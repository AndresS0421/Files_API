import formidable from "formidable";
import { options } from "../../lib/files/upload/options.js";
import { upload_to_bucket } from "../../lib/files/upload/upload_file.js";
import { create_thesis_file_service } from "../../services/thesis/create_thesis_file.service.js";
import { update_service as update_thesis_register } from "../../services/thesis/update.service.js";
import { get_by_id_service as get_user_by_id } from "../../services/user/get_by_id.service.js";
import { get_by_user_id_service as get_thesis_by_user_id } from "../../services/thesis/get_by_user_id.service.js";
import { VerificationError, get_response_error_data } from "../../lib/errors/get_response_error_data.js"

export async function update_controller(req, res) {
    try {
        // Method verification
        if (req.method !== "PUT") {
            throw new VerificationError(405, "Request method not allowed.");
        }

        // Body type verification
        if (!req.is("multipart/form-data")) {
            throw new VerificationError(400, "Request body not allowed, it's needed a form-data.");
        }

        // Parse form
        const form = formidable(options);
        const [fields, files] = await form.parse(req);

        // Check params fields
        if (!fields?.thesis && !files?.thesis) {
            throw new VerificationError(400, "Server did not reveive any elements.");
        }

        // Parse thesis JSON
        let thesis_body;
        try {
            thesis_body = JSON.parse(fields?.thesis?.[0]);
        } catch (e) {
            throw new VerificationError(400, "Error parsing form-data JSON.");
        }

        // Verify JSON params
        if (!thesis_body?.user_id) {
            throw new VerificationError(400, "UserID must be included.");
        }

        // Check if user exists
        const user = await get_user_by_id(thesis_body?.user_id);
        if (!user) {
            throw new VerificationError(404, "User not found.");
        }

        // Upload new file if exists
        let uploaded_file;
        // Obtain user thesis
        let user_thesis = await get_thesis_by_user_id(thesis_body?.user_id);
        user_thesis = user_thesis[0];
        if (files?.thesis) {
            try {
                // Obtain version number
                let last_thesis_version = user_thesis?.thesisFiles?.pop()?.thesis_url;
                last_thesis_version = last_thesis_version.split("_")[1];
                last_thesis_version = parseInt(last_thesis_version.match(/v(\d+)\./)[1]);
                // Get new thesis version
                const new_version = last_thesis_version+1;

                // Upload new thesis file
                uploaded_file = await upload_to_bucket(files?.thesis, `${user?.id}_v${new_version}.pdf`);
                if (!uploaded_file?.location) {
                    throw new VerificationError(400, "Error uploading file.");
                }

                // Create thesis file register on database
                const thesis_file = await create_thesis_file_service(user_thesis?.id, uploaded_file?.location);
                if (!thesis_file) {
                    throw new VerificationError(400, "Error uploading file.");
                }
            } catch (e) {
                throw new VerificationError(400, "Error uploading file.");
            }
        }

        let uploaded_thesis;
        if (thesis_body?.title || thesis_body?.abstract || thesis_body?.key_words || thesis_body?.category_id) {
            try {
                // Add thesis id
                thesis_body.id = user_thesis?.id;
                // Update thesis register
                uploaded_thesis = await update_thesis_register(thesis_body);

                if (!uploaded_thesis) {
                    throw new VerificationError(400, "Error uploading thesis data.");
                }
            } catch (e) {
                throw new VerificationError(400, "Error uploading thesis data.");
            }
        }

        return res.status(200).json({successful: true, data: `Update successful of thesis userID: ${thesis_body?.user_id}`});
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({sucessful: false, message: message});
    }
}
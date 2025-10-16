import formidable from "formidable";
import { options } from "../../lib/files/upload/options.js";
import { upload_to_bucket } from "../../lib/files/upload/upload_file.js";
import { update_service as update_file_register } from "../../services/files/update.service.js";
import { get_by_user_id_service as get_files_by_user_id } from "../../services/files/get_by_user_id.service.js";
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
        if (!fields?.file && !files?.file) {
            throw new VerificationError(400, "Server did not receive any elements.");
        }

        // Parse file JSON
        let file_body;
        try {
            file_body = JSON.parse(fields?.file?.[0]);
        } catch (e) {
            throw new VerificationError(400, "Error parsing form-data JSON.");
        }

        // Verify JSON params
        if (!file_body?.user_id) {
            throw new VerificationError(400, "UserID must be included.");
        }

        // Upload new file if exists
        let uploaded_file;
        // Obtain user files
        let user_files = await get_files_by_user_id(file_body?.user_id);
        user_files = user_files[0];
        if (files?.file) {
            try {
                // Upload new file
                uploaded_file = await upload_to_bucket(files?.file, `${file_body?.user_id}_${Date.now()}.pdf`);
                if (!uploaded_file?.location) {
                    throw new VerificationError(400, "Error uploading file.");
                }
            } catch (e) {
                throw new VerificationError(400, "Error uploading file.");
            }
        }

        let uploaded_file_data;
        if (file_body?.description || file_body?.category_id || uploaded_file?.location) {
            try {
                // Add file id
                file_body.id = user_files?.id;
                if (uploaded_file?.location) {
                    file_body.url = uploaded_file.location;
                }
                // Update file register
                uploaded_file_data = await update_file_register(user_files?.id, file_body);

                if (!uploaded_file_data) {
                    throw new VerificationError(400, "Error uploading file data.");
                }
            } catch (e) {
                throw new VerificationError(400, "Error uploading file data.");
            }
        }

        return res.status(200).json({successful: true, data: `Update successful of file userID: ${file_body?.user_id}`});
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({sucessful: false, message: message});
    }
}

import formidable from "formidable";
import { options } from "../../lib/files/upload/options.js";
import { upload_to_bucket } from "../../lib/files/upload/upload_file.js";
import { create_service } from "../../services/thesis/create.service.js";
import { get_by_id_service } from "../../services/user/get_by_id.service.js";
import { get_by_user_id_service } from "../../services/thesis/get_by_user_id.service.js";
import { VerificationError, get_response_error_data } from "../../lib/errors/get_response_error_data.js";

export async function upload_controller(req, res) {
    try {
        // Method verification
        if (req.method !== "POST") {
            throw new VerificationError(405, "Request method not allowed.");            
        }

        // Body type verification
        if (!req.is('multipart/form-data')) {
            throw new VerificationError(400, "Body type must be form-data.");
        }

        // Parse form
        const form = formidable(options);
        const [fields, files] = await form.parse(req);

        if (!files.thesis) {
            throw new VerificationError(400, "Thesis file must be included.");
        }

        // Obtain fields
        let thesis;

        try {
            thesis = JSON.parse(fields?.thesis?.[0]);
        } catch (e) {
            throw new VerificationError(400, "Error parsing data.");
        }

        // Fields verification
        if (!thesis?.title || !thesis?.abstract || !thesis?.key_words || !thesis?.user_id || !thesis?.category_id) {
            throw new VerificationError(400, "Title, author, year, abstract, keywords, user_id and category_id from the thesis, must be included.");
        }

        // Unique uploading of file verification
        const user_thesis = await get_by_user_id_service(thesis?.user_id);
        if (user_thesis?.length > 0) {
            throw new VerificationError(400, "User already have a thesis uploaded.");
        }

        // Upload file
        let thesis_url;
        
        try {
            thesis_url = await upload_to_bucket(files.thesis, `${thesis.user_id}_v1.pdf`);
        } catch (e) {
            throw new VerificationError(400, "Error uploading thesis file.");
        }

        // Obtain User
        const user = await get_by_id_service(thesis.user_id);

        // Adjust thesis details
        thesis.title = `${thesis?.title}`;
        thesis.thesis_url = thesis_url?.location;
        thesis.author = `${user?.first_name} ${user?.last_name}`;
        thesis.year = new Date().getFullYear();

        // Create thesis register on database
        let thesis_result;
        try {
            thesis_result = await create_service(thesis);
        } catch (e) {
            throw new VerificationError(400, "Error creating register in database.");
        }

        return res.status(200).json({successful: true, data: thesis_result});
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({successful: false, message: message});
    }
}
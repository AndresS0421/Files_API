import formidable from "formidable";
import { options } from "../../lib/files/upload/options.js";
import { upload_to_bucket } from "../../lib/files/upload/upload_file.js";
import { create_service } from "../../services/files/create.service.js";
import { get_by_user_id_service } from "../../services/files/get_by_user_id.service.js";
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

        if (!files.file) {
            throw new VerificationError(400, "File must be included.");
        }

        // Obtain fields
        let file;

        try {
            file = JSON.parse(fields?.file?.[0]);
        } catch (e) {
            throw new VerificationError(400, "Error parsing data.");
        }

        // Fields verification
        if (!file?.description || !file?.user_id || !file?.category_id) {
            throw new VerificationError(400, "Description, user_id and category_id from the file, must be included.");
        }

        // Unique uploading of file verification
        const user_files = await get_by_user_id_service(file?.user_id);
        if (user_files?.length > 0) {
            throw new VerificationError(400, "User already have a file uploaded.");
        }

        // Upload file
        let file_url;
        
        try {
            file_url = await upload_to_bucket(files.file, `${file.user_id}_${Date.now()}.pdf`);
        } catch (e) {
            throw new VerificationError(400, "Error uploading file.");
        }

        // Adjust file details
        file.url = file_url?.location;

        // Create file register on database
        let file_result;
        try {
            file_result = await create_service(file);
        } catch (e) {
            throw new VerificationError(400, "Error creating register in database.");
        }

        return res.status(200).json({successful: true, data: file_result});
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({successful: false, message: message});
    }
}

import { delete_file } from "../../lib/files/delete/delete_file.js";
import { get_by_user_id_service } from "../../services/files/get_by_user_id.service.js";
import { delete_service } from "../../services/files/delete.service.js";
import { VerificationError, get_response_error_data } from "../../lib/errors/get_response_error_data.js";

export async function delete_controller(req, res) {
    try {
        // Method verification
        if (req.method !== "DELETE") {
            throw new VerificationError(405, "Request method not allowed.");
        }

        // Obtain params
        const { user_id, file_id } = req.query;

        if (!user_id || !file_id) {
            throw new VerificationError(400, "UserID and FileID are required.");
        }

        // Obtain Files
        let files = await get_by_user_id_service(user_id);
        files = files[0];

        if (files?.id !== file_id) {
            throw new VerificationError(400, "File not from user.");
        }

        // Delete files
        try {
            await delete_file(files.url);
        } catch (e) {
            throw new VerificationError(400, "Error deleting file.");
        }

        try {
            await delete_service(file_id);
        } catch (e) {
            throw new VerificationError(400, "Error deleting file on database.");
        }

        return res.status(200).json({successful: true, data: `File id: ${file_id}, successfully deleted.`});
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({successful: false, message: message});
    }
}

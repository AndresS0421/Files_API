import { get_by_id_service } from "../../services/files/get_by_id.service.js";
import { VerificationError, get_response_error_data } from "../../lib/errors/get_response_error_data.js";

export async function get_by_id_controller(req, res) {
    try {
        // Method verification
        if (req.method !== "GET") {
            throw new VerificationError(405, "Request method not allowed.");
        }

        const { file_id, role } = req.query;

        if (role !== "ADMINISTRATOR" && role !== "PROFESSOR") {
            throw new VerificationError(400, "Access not allowed.");
        }

        if (!file_id) {
            throw new VerificationError(400, "File ID is required.");
        }

        const file = await get_by_id_service(file_id);

        if (!file?.url) {
            throw new VerificationError(404, "File not found.");
        }

        return res.status(200).json({successful: true, data: file});
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({successful: false, message: message});
    }
}

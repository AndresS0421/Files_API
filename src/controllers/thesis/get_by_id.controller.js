import { get_by_id_service } from "../../services/thesis/get_by_id.service.js";
import { VerificationError, get_response_error_data } from "../../lib/errors/get_response_error_data.js";

export async function get_by_id_controller(req, res) {
    try {
        // Method verification
        if (req.method !== "GET") {
            throw new VerificationError(405, "Request method not allowed.");
        }

        const { thesis_id, role } = req.query;

        if (role !== "ADMINISTRATOR" && role !== "PROFESSOR") {
            throw new VerificationError(400, "Access not allowed.");
        }

        if (!thesis_id) {
            throw new VerificationError(400, "Thesis ID is  required.");
        }

        const thesis = await get_by_id_service(thesis_id);

        if (!thesis?.title) {
            throw new VerificationError(404, "Thesis not found.");
        }

        return res.status(200).json({successful: true, data: thesis});
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({successful: false, message: message});
    }
}
import { get_by_user_id_service as get_tesis_by_user_id } from "../../services/thesis/get_by_user_id.service.js";
import { VerificationError, get_response_error_data } from "../../lib/errors/get_response_error_data.js";

export async function get_by_user_id_controller(req, res) {
    try {
        // Method verification
        if (req.method !== "GET") {
            throw new VerificationError(405, "Request method not allowed.");
        }

        // Get user id
        const { user_id } = req.query;

        if (!user_id) {
            throw new VerificationError(400, "UserID is required.");
        }

        const tesis = await get_tesis_by_user_id(user_id);

        if (!(tesis?.length > 0)) {
            throw new VerificationError(404, "Thesis not found.");
        }

        return res.status(200).json({successful: true, data: tesis});
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({successful: false, message: message});
    }
}
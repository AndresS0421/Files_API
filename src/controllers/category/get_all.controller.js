import { get_all_service as get_all_categories } from "../../services/category/get_all.service.js";
import { VerificationError, get_response_error_data } from "../../lib/errors/get_response_error_data.js";

export async function get_all_controller(req, res) {
    try {
        // Method verification
        if (req.method !== "GET") {
            throw new VerificationError(405, "Request method not allowed.");
        }

        const categories = await get_all_categories();

        return res.status(200).json({successful: true, data: categories});
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({successful: false, message: message});
    }
}
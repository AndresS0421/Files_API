import { create_service as create_category_service } from "../../services/category/create.service.js";
import { VerificationError, get_response_error_data } from "../../lib/errors/get_response_error_data.js";

export async function create_controller(req, res) {
    try {
        // Method Verification
        if (req.method !== "POST") {
            throw new VerificationError(405, "Request method not allowed.")
        }

        // Get body
        const { category, role } = req.body;

        if (role !== "ADMINISTRATOR") {
            throw new VerificationError(400, "Access not allowed.");
        }

        if (!category?.name) {
            throw new VerificationError(400, "Name is required.");
        }
        // Create category
        const created_category = await create_category_service(category);

        return res.status(200).json({successful: true, data: created_category});
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({successful: false, message: message});
    }
}
import { update_by_id as update_category } from "../../services/category/update_by_id.service.js";
import { VerificationError, get_response_error_data } from "../../lib/errors/get_response_error_data.js";

export async function update_controller(req, res) {
    try {
        // Method verification
        if (req.method !== "PUT") {
            throw new VerificationError(405, "Request method not allowed");
        }

        // Get body
        const { category, role } = req.body;

        if (role !== "ADMINISTRATOR") {
            throw new VerificationError(400, "Access not allowed.");
        }

        const id = category.id;

        // Check if exists id
        if (!id) {
            throw new VerificationError(400, "Error getting the category");
        }

        delete category.id;

        // Update category
        const updated_category = await update_category(id, category);

        // Check update category
        if (!update_category) {
            throw new VerificationError(400, "Update category process cannot be done.");
        }

        return res.status(200).json({successful: true, data: updated_category});
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({successful: false, message: message});
    }
}
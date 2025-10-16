import { delete_service as delete_category } from "../../services/category/delete.service.js";
import { VerificationError, get_response_error_data } from "../../lib/errors/get_response_error_data.js";

export async function delete_controller(req, res) {
    try {
        // Method verification
        if (req.method !== "DELETE") {
            throw new VerificationError(405, "Request method not allowed.");
        }

        // Get id
        const { id, role } = req.query;

        if (role !== "ADMINISTRATOR") {
            throw new VerificationError(400, "Access not allowed.");
        }

        // Check ID
        if (!id) {
            throw new VerificationError(400, "ID is required.");
        }

        // Delete category
        const deleted_category = await delete_category(id);

        // Check deleted category was done
        if (!delete_category) {
            throw new VerificationError(400, "Category wasn't successfully deleted.");
        }

        return res.status(200).json({successful: true, data: delete_category});
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({successful: false, message: message});
    }
}
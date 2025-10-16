import { get_all_service } from "../../services/thesis/get_all.service.js";
import { VerificationError, get_response_error_data } from "../../lib/errors/get_response_error_data.js";

export async function get_all_controller(req, res) {
    try {
        // Method verification
        if (req.method !== "GET") {
            throw new VerificationError(405, "Request method not allowed.");
        }

        let { role, title, author, year, keywords } = req.query;

        if (role !== "ADMINISTRATOR" && role !== "PROFESSOR") {
            throw new VerificationError(400, "Access not allowed.");
        }

        year = parseInt(year);

        let thesis_all = await get_all_service(title, author, year, keywords);

        return res.status(200).json({successful: true, data: thesis_all});
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({successful: false, message: message});
    }
}
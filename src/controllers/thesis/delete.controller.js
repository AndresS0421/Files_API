import { delete_file } from "../../lib/files/delete/delete_file.js";
import { get_by_user_id_service } from "../../services/thesis/get_by_user_id.service.js";
import { delete_service } from "../../services/thesis/delete.service.js";
import { VerificationError, get_response_error_data } from "../../lib/errors/get_response_error_data.js";

export async function delete_controller(req, res) {
    try {
        // Method verification
        if (req.method !== "DELETE") {
            throw new VerificationError(405, "Request method not allowed.");
        }

        // Obtain params
        const { user_id, thesis_id } = req.query;

        if (!user_id || !thesis_id) {
            throw new VerificationError(400, "UserID and ThesisID are required.");
        }

        // Obtain Thesis
        let thesis = await get_by_user_id_service(user_id);
        thesis = thesis[0];

        if (thesis?.id !== thesis_id) {
            throw new VerificationError(400, "Thesis not from user.");
        }

        // Delete thesis
        try {
            thesis.thesisFiles.map(async (file) => {
                await delete_file(file.thesis_url);
            });
        } catch (e) {
            throw new VerificationError(400, "Error deleting thesis file.");
        }

        try {
            await delete_service(thesis_id);
        } catch (e) {
            throw new VerificationError(400, "Error deleting thesis on database.");
        }

        return res.status(200).json({successful: true, data: `Thesis id: ${thesis_id}, successfully deleted.`});
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({successful: false, message: message});
    }
}
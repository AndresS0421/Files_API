import { create_service as create_user } from "../../services/user/create.service.js";
import { hash_password } from "../../lib/hashing/hash_password.js";
import { VerificationError, get_response_error_data } from "../../lib/errors/get_response_error_data.js";

export async function create_controller(req, res) {
    try {
        // Method verification
        if (req.method !== "POST") {
            throw new VerificationError(405, "Request method not allowed.");
        }

        // Obtain user
        const user = req.body;
        // Check user parameters
        if (!user?.first_name || !user?.last_name || !user?.role || !user?.email || !user?.password) {
            throw new VerificationError(400, "First name, last name, email, password are required.");
        }

        // Hash password
        const hashed_password = await hash_password(user.password);
        if (!hashed_password) {
            throw new VerificationError(400, "User creation problems.");
        }

        user.password = hashed_password;

        // Create user
        const created_user = await create_user(user);

        return res.status(200).json({successful: true, data: created_user});
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({successful: false, message: message});
    }
}
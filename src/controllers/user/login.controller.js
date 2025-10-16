import { get_by_email_service } from "../../services/user/get_by_email.service.js";
import { compare_password } from "../../lib/hashing/compare_password.js";
import { VerificationError, get_response_error_data } from "../../lib/errors/get_response_error_data.js";

export async function login_controller(req, res) {
    try {
        // Method verification
        if (req.method !== "POST") {
            throw new VerificationError(405, "Request method not allowed.");
        }

        // Body type verification
        if (!req.is('application/json')) {
            throw new VerificationError(400, "Invalid request body type.");
        }

        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            throw new VerificationError(400, "Email and password are required.");
        }

        // Get user by email
        const user = await get_by_email_service(email);

        if (!user) {
            throw new VerificationError(400, "Email or password incorrect.");
        }

        // Validate password
        const password_valid = await compare_password(password, user.credential.credential);

        if (!password_valid) {
            throw new VerificationError(400, "Email or password incorrect.");
        }

        // Get user data
        const user_data = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
        };

        return res.status(200).json({successful: true, data: user_data});
    } catch (e) {
        const { status, message } = get_response_error_data(e);
        return res.status(status).json({successful: false, message: message});
    }
}
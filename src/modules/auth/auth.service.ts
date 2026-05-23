import bcrypt from "bcryptjs";
import { pool } from "../../db";
import config from "../../config";

const signupIntoDB = async (payload: any) => {
    const { name, email, password, role } = payload;

    const userExists = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
    );

    if (userExists.rows.length > 0) {
        throw new Error("User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, config.salt_rounds);

    const query = `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at, updated_at
    `;

    const values = [name, email, hashedPassword, role || 'contributor'];
    const result = await pool.query(query, values);

    return result.rows[0];
};

export const authService = {
    signupIntoDB
};
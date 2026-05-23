import bcrypt from "bcrypt";
import { pool } from "../../db";
import config from "../../config";
import jwt from "jsonwebtoken";

const signupIntoDB = async (payload: any) => {
    const { name, email, password, role } = payload;

    const userExists = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
    );

    if (userExists.rows.length > 0) {
        throw new Error("User already exists with this email");
    }

    const saltRounds = Number(config.salt_rounds) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at, updated_at
    `;

    const values = [name, email, hashedPassword, role || 'contributor'];
    const result = await pool.query(query, values);

    return result.rows[0];
};

const loginUser = async (payload: any) => {
    const { email, password } = payload;

    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);
    const user = result.rows[0];

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
        throw new Error("Invalid email or password");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        role: user.role
    };

    const token = jwt.sign(jwtPayload, config.jwt_secret as string, {
        expiresIn: "1d"
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
        token,
        user: userWithoutPassword
    };
};

export const authService = {
    signupIntoDB,
    loginUser
};
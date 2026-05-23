import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(process.cwd(), ".env")
});

const config = {
    port: process.env.PORT || 5000,
    database_connection_url: process.env.DATABASE_CONNECTION_URL,
    salt_rounds: Number(process.env.SALT_ROUNDS) || 10,
    jwt_secret: process.env.JWT_SECRET || "super_secret_devpulse_key",
};

export default config;
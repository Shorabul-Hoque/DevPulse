import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(process.cwd(), ".env")
});

const config = {
    port: process.env.PORT || 5000,
    database_connection_url: process.env.DATABASE_CONNECTION_URL || "shorabul_super_secret_devpulse_key",
    salt_rounds: Number(process.env.SALT_ROUNDS) || 10,
};

export default config;
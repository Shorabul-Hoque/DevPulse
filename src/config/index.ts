import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(process.cwd(), ".env")
});

const config = {
    port: process.env.PORT as string,
    database_connection_url: process.env.DATABASE_CONNECTION_URL as string,
};

export default config;
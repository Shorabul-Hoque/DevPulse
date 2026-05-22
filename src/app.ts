import express, {
    type Application,
    type Request,
    type Response
} from "express";
// import { authRoute } from "./modules/auth/auth.route";
// import { issueRoute } from "./modules/issue/issue.route";
// import logger from "./middleware/logger";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();

// app.use(cookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
// app.use(logger);

// app.use(cors({
//     origin: ['http://localhost:3000', 'https://devpulse-api.vercel.app'],
//     credentials: true
// }));

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome to DevPulse API",
        author: "Shorabul Hoque",
    });
});

// app.use("/api/auth", authRoute);
// app.use("/api/issues", issueRoute);
// app.use(globalErrorHandler);

export default app;
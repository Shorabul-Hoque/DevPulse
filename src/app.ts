import express, {
    type Application,
    type Request,
    type Response
} from "express";
import { authRoute } from "./modules/auth/auth.route";


const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome to DevPulse API",
        author: "Shorabul Hoque",
    });
});

app.use("/api/auth", authRoute);

export default app;
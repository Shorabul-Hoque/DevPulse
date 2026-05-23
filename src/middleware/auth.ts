import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - Missing token" });
    }

    try {
        const decoded = jwt.verify(token, config.jwt_secret as string);
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized - Invalid or expired token" });
    }
};


import { type Request, type Response, type NextFunction } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";

const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.signupIntoDB(req.body);


        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "User registered successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const authController = {
    signup
};
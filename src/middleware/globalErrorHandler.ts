import { type Request, type Response, type NextFunction } from "express";

const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong!";
    let errorDetails = err.errors || err.stack || null;

    if (err.message === "User already exists with this email" || err.message === "Invalid email or password") {
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        errors: errorDetails ? "Validation or duplicate resource error" : message
    });
};

export default globalErrorHandler;
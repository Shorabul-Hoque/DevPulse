import type { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";

const logger = (req: Request, res: Response, next: NextFunction): void => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${req.method} -> ${req.url}\n`;

    console.log(`[LOG] ${req.method} - ${req.url} - ${timestamp}`);

    const logFilePath = path.join(process.cwd(), "Logger.txt");

    fs.appendFile(logFilePath, logMessage, (error) => {
        if (error) {
            console.error("Failed to write log to file:", error);
        }
    });

    next();
};

export default logger;
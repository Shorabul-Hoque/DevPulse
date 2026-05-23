import { type Request, type Response, type NextFunction } from "express";
import { issueService } from "./issue.service";
import sendResponse from "../../utility/sendResponse";

const createIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const reporterId = (req as any).user.id;
        const result = await issueService.createIssueInDB(req.body, reporterId);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue created successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const getAllIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await issueService.getAllIssuesFromDB(req.query);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issues retrieved successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const getSingleIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const issueId = Number(req.params.id);
        const result = await issueService.getSingleIssueFromDB(issueId);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue retrieved successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const updateIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const issueId = Number(req.params.id);
        const user = (req as any).user;

        const result = await issueService.updateIssueInDB(issueId, req.body, user);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue updated successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const deleteIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const issueId = Number(req.params.id);
        await issueService.deleteIssueFromDB(issueId);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue
};
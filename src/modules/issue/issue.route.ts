import { Router } from "express";
import { issueController } from "./issue.controller";
import { authGuard } from "../../middleware/auth";


const router = Router();

router.post("/", authGuard, issueController.createIssue);

export const issueRoute = router;
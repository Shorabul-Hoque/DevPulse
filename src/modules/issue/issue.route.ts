import { Router } from "express";
import { issueController } from "./issue.controller";
import { authGuard } from "../../middleware/auth";


const router = Router();

router.post("/", authGuard, issueController.createIssue);
router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getSingleIssue);
router.patch("/:id", authGuard, issueController.updateIssue);

export const issueRoute = router;
import { Router } from "express";
import { issueController } from "./issue.controller";
import { authGuard, roleGuard } from "../../middleware/auth";


const router = Router();

router.post("/", authGuard, issueController.createIssue);
router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getSingleIssue);
router.patch("/:id", authGuard, issueController.updateIssue);
router.delete("/:id", authGuard, roleGuard("maintainer"), issueController.deleteIssue);

export const issueRoute = router;
import { Router } from "express";
import {
  approveRequestByHr,
  approveRequestByManager,
  cancelRequest,
  createRequest,
  getRequestApprovalLogs,
  getRequestById,
  getRequests,
  rejectRequestByHr,
  rejectRequestByManager,
  resubmitRequest,
  returnRequestByHr,
  returnRequestByManager,
  updateRequest,
} from "../controllers/request.controller";
import { uploadRequestAttachments } from "../middleware/upload";

const router = Router();

router.get("/requests", getRequests);
router.get("/requests/:id", getRequestById);
router.get("/requests/:id/logs", getRequestApprovalLogs);

router.post(
  "/requests",
  uploadRequestAttachments.array("attachments", 5),
  createRequest
);

router.patch("/requests/:id", updateRequest);
router.patch("/requests/:id/resubmit", resubmitRequest);
router.patch("/requests/:id/cancel", cancelRequest);

router.patch("/requests/:id/approve", approveRequestByManager);
router.patch("/requests/:id/return", returnRequestByManager);
router.patch("/requests/:id/reject", rejectRequestByManager);

router.patch("/requests/:id/hr/approve", approveRequestByHr);
router.patch("/requests/:id/hr/return", returnRequestByHr);
router.patch("/requests/:id/hr/reject", rejectRequestByHr);

export default router;
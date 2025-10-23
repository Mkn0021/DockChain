import { Router } from "express";
import DocumentController from "@controllers/document.controller";

const router = Router();

router.post("/issue", ...DocumentController.issueDocument);
router.post("/:id/revoke", ...DocumentController.revokeDocument);
router.get("/:id", ...DocumentController.getDocumentById);
router.get("/", ...DocumentController.getAllDocuments);
router.post("/verify", ...DocumentController.verifyDocument);
router.get("/:id/qr", ...DocumentController.generateQrCode);
router.get("/:id/pdf", ...DocumentController.generatePdf);

export default router;
import { Router } from "express";
import TemplateController from "@controllers/template.controller";

const router = Router();

router.post("/", ...TemplateController.createTemplate);
router.put("/:id", ...TemplateController.updateTemplate);
router.delete("/:id", ...TemplateController.deleteTemplate);
router.get("/:id", ...TemplateController.getTemplateById);
router.get("/", ...TemplateController.getAllTemplates);

export default router;
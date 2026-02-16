import { Router } from "express";
import {
    getCertificateTemplates,
    createCertificateTemplate,
    updateCertificateTemplate,
    deleteCertificateTemplate,
    updateCertificateTemplateStatus,
} from "../Controllers/CertificateTemplateCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.get("/", getCertificateTemplates);
router.post("/", createCertificateTemplate);
router.put("/:id", updateCertificateTemplate);
router.delete("/:id", deleteCertificateTemplate);
router.put("/:id/status", updateCertificateTemplateStatus);

export default router;

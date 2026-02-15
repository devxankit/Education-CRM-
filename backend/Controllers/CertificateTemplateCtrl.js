import CertificateTemplate from "../Models/CertificateTemplateModel.js";

export const getCertificateTemplates = async (req, res) => {
    try {
        const { branchId, type, status } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        const query = { instituteId };
        if (branchId) query.branchId = branchId;
        if (type) query.type = type;
        if (status) query.status = status;

        const templates = await CertificateTemplate.find(query).sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            data: templates,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createCertificateTemplate = async (req, res) => {
    try {
        const { branchId, name, code, type, category, purpose, content, header, footer, orientation } = req.body;
        const instituteId = req.user.instituteId || req.user._id;
        const updatedBy = req.user.name || req.user.email || "Admin";

        if (!branchId || !name) {
            return res.status(400).json({ success: false, message: "Branch ID and name are required" });
        }

        const existingCount = await CertificateTemplate.countDocuments({ instituteId, branchId });
        const codeValue = code || `DOC-${String(existingCount + 1).padStart(4, "0")}`;

        const template = new CertificateTemplate({
            instituteId,
            branchId,
            name,
            code: codeValue,
            type: type || "STUDENT",
            category: category || "GENERAL",
            version: "1.0",
            status: "DRAFT",
            purpose: purpose || "",
            content: content || "",
            header: header !== false,
            footer: footer !== false,
            orientation: orientation || "PORTRAIT",
            updatedBy,
        });
        await template.save();

        res.status(201).json({
            success: true,
            message: "Certificate template created",
            data: template,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCertificateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const instituteId = req.user.instituteId || req.user._id;
        const updatedBy = req.user.name || req.user.email || "Admin";
        const update = { ...req.body, updatedBy };
        delete update.instituteId;
        delete update.branchId;
        delete update._id;
        delete update.id;

        const template = await CertificateTemplate.findOne({ _id: id, instituteId });
        if (!template) {
            return res.status(404).json({ success: false, message: "Template not found" });
        }

        if (update.content !== undefined || update.name !== undefined) {
            const currentVersion = parseFloat(template.version) || 1;
            update.version = (currentVersion + 0.1).toFixed(1);
        }

        const updated = await CertificateTemplate.findOneAndUpdate(
            { _id: id, instituteId },
            { $set: update },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Template updated",
            data: updated,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteCertificateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const instituteId = req.user.instituteId || req.user._id;

        const template = await CertificateTemplate.findOneAndDelete({ _id: id, instituteId });

        if (!template) {
            return res.status(404).json({ success: false, message: "Template not found" });
        }

        res.status(200).json({
            success: true,
            message: "Template deleted",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCertificateTemplateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        if (!["DRAFT", "ACTIVE", "ARCHIVED"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const template = await CertificateTemplate.findOneAndUpdate(
            { _id: id, instituteId },
            { $set: { status } },
            { new: true, runValidators: true }
        );

        if (!template) {
            return res.status(404).json({ success: false, message: "Template not found" });
        }

        res.status(200).json({
            success: true,
            message: "Status updated",
            data: template,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

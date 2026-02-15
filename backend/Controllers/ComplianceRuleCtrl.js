import ComplianceRule from "../Models/ComplianceRuleModel.js";

export const getComplianceRules = async (req, res) => {
    try {
        const { branchId } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        const query = { instituteId };
        if (branchId) query.branchId = branchId;

        const rules = await ComplianceRule.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: rules,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createComplianceRule = async (req, res) => {
    try {
        const { branchId, name, description, documentTypes, validationRules, retention, isActive, appliesTo } = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        if (!branchId || !name) {
            return res.status(400).json({ success: false, message: "Branch ID and name are required" });
        }

        const rule = new ComplianceRule({
            instituteId,
            branchId,
            name,
            description: description || "",
            documentTypes: Array.isArray(documentTypes) ? documentTypes : [],
            validationRules: Array.isArray(validationRules) ? validationRules : [],
            retention: retention || "7 years",
            isActive: isActive !== false,
            appliesTo: appliesTo || "students",
        });
        await rule.save();

        res.status(201).json({
            success: true,
            message: "Compliance rule created",
            data: rule,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateComplianceRule = async (req, res) => {
    try {
        const { id } = req.params;
        const instituteId = req.user.instituteId || req.user._id;
        const update = req.body;
        delete update.instituteId;
        delete update.branchId;
        delete update._id;

        const rule = await ComplianceRule.findOneAndUpdate(
            { _id: id, instituteId },
            { $set: update },
            { new: true, runValidators: true }
        );

        if (!rule) {
            return res.status(404).json({ success: false, message: "Compliance rule not found" });
        }

        res.status(200).json({
            success: true,
            message: "Compliance rule updated",
            data: rule,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteComplianceRule = async (req, res) => {
    try {
        const { id } = req.params;
        const instituteId = req.user.instituteId || req.user._id;

        const rule = await ComplianceRule.findOneAndDelete({ _id: id, instituteId });

        if (!rule) {
            return res.status(404).json({ success: false, message: "Compliance rule not found" });
        }

        res.status(200).json({
            success: true,
            message: "Compliance rule deleted",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const toggleComplianceRuleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const instituteId = req.user.instituteId || req.user._id;

        const rule = await ComplianceRule.findOne({ _id: id, instituteId });
        if (!rule) {
            return res.status(404).json({ success: false, message: "Compliance rule not found" });
        }

        rule.isActive = !rule.isActive;
        await rule.save();

        res.status(200).json({
            success: true,
            message: `Rule ${rule.isActive ? "activated" : "deactivated"} successfully`,
            data: rule,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

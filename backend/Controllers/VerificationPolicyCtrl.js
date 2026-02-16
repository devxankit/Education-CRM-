import VerificationPolicy from "../Models/VerificationPolicyModel.js";

export const getVerificationPolicies = async (req, res) => {
    try {
        const { branchId, entity } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }

        const query = { instituteId, branchId };
        if (entity) query.entity = entity;

        const policies = await VerificationPolicy.find(query).sort({ order: 1, createdAt: 1 });

        res.status(200).json({
            success: true,
            data: policies,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const saveVerificationPolicies = async (req, res) => {
    try {
        const { branchId, entity, policies } = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        if (!branchId || !entity || !Array.isArray(policies)) {
            return res.status(400).json({
                success: false,
                message: "branchId, entity, and policies array are required",
            });
        }

        await VerificationPolicy.deleteMany({ instituteId, branchId, entity });

        const toInsert = policies.map((p, idx) => ({
            instituteId,
            branchId,
            entity,
            documentName: p.documentName || p.name || "Unnamed",
            category: p.category || "General",
            mode: p.mode || "manual",
            levels: Array.isArray(p.levels)
                ? p.levels.map((l) => ({
                    role: l.role || "Admin",
                    slaHours: Number(l.slaHours) || 24,
                    canReject: l.canReject !== false,
                }))
                : [],
            order: idx,
        }));

        const inserted = await VerificationPolicy.insertMany(toInsert);

        res.status(200).json({
            success: true,
            message: "Verification policies saved",
            data: inserted,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

import DocumentRule from "../Models/DocumentRuleModel.js";

// ================= GET OR INITIALIZE DOCUMENT RULE =================
export const getDocumentRule = async (req, res) => {
    try {
        const { branchId } = req.query;
        const instituteId = req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }

        let rule = await DocumentRule.findOne({ instituteId, branchId });

        if (!rule) {
            // Return defaults
            return res.status(200).json({
                success: true,
                message: "No configuration found, providing defaults",
                data: {
                    branchId,
                    categories: [
                        { name: 'Identity Proof', active: true, mandatory: true },
                        { name: 'Address Proof', active: true, mandatory: true },
                        { name: 'Academic Records', active: true, mandatory: false },
                        { name: 'Medical Records', active: false, mandatory: false },
                        { name: 'Transfer Certificates', active: true, mandatory: true },
                    ],
                    workflow: { verificationLevel: 'single', autoReject: false, retentionYears: 5, autoArchive: true, expiryAction: 'Archive' },
                    studentRules: [
                        { name: 'Aadhaar Card', stage: 'admission', mandatory: true, verifier: 'admin' },
                        { name: 'Birth Certificate', stage: 'admission', mandatory: true, verifier: 'admin' },
                        { name: 'Transfer Certificate', stage: 'post-admission', mandatory: true, verifier: 'registrar' },
                        { name: 'Previous Marksheet', stage: 'admission', mandatory: false, verifier: 'class-teacher' }
                    ],
                    staffRules: [
                        { name: 'Identity Proof (PAN/Aadhaar)', type: 'all', mandatory: true },
                        { name: 'Qualification Degrees', type: 'teaching', mandatory: true },
                        { name: 'Experience Letters', type: 'teaching', mandatory: true },
                        { name: 'Police Verification', type: 'all', mandatory: false }
                    ]
                }
            });
        }

        res.status(200).json({
            success: true,
            data: rule,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= SAVE DOCUMENT RULE =================
export const saveDocumentRule = async (req, res) => {
    try {
        const { branchId, ...ruleData } = req.body;
        const instituteId = req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }

        const existing = await DocumentRule.findOne({ instituteId, branchId });
        if (existing && existing.isLocked && !req.body.unlockReason) {
            return res.status(403).json({
                success: false,
                message: "Document policy is locked. Provide an audit reason to modify."
            });
        }

        const rule = await DocumentRule.findOneAndUpdate(
            { instituteId, branchId },
            {
                $set: {
                    ...ruleData,
                    instituteId,
                    branchId
                }
            },
            { upsert: true, new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Document policy saved successfully",
            data: rule,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= LOCK / UNLOCK DOCUMENT RULE =================
export const toggleDocumentLock = async (req, res) => {
    try {
        const { id } = req.params;
        const { isLocked, unlockReason } = req.body;

        const rule = await DocumentRule.findById(id);
        if (!rule) {
            return res.status(404).json({ success: false, message: "Policy not found" });
        }

        rule.isLocked = isLocked;
        if (!isLocked && unlockReason) {
            rule.unlockReason = unlockReason;
        }

        await rule.save();

        res.status(200).json({
            success: true,
            message: `Document policy ${isLocked ? 'Locked' : 'Unlocked'} successfully`,
            data: rule
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

import DocumentRule from "../Models/DocumentRuleModel.js";

// ================= GET OR INITIALIZE DOCUMENT RULE =================
export const getDocumentRule = async (req, res) => {
    try {
        const { branchId } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }

        // Handle 'main' or invalid ID to avoid CastError
        const defaultGovernance = {
            provisionalAdmission: { allowed: false, maxValidityDays: 45 },
            overrideRoles: ['Super Admin']
        };
        const defaultStudentRules = [
            { name: 'Aadhaar Card', category: 'Identity', stage: 'admission', mandatory: true, gracePeriodDays: 7, enforcement: 'hard_block', verifier: 'admin' },
            { name: 'Birth Certificate', category: 'Identity', stage: 'admission', mandatory: true, gracePeriodDays: 7, enforcement: 'hard_block', verifier: 'admin' },
            { name: 'Transfer Certificate', category: 'Academic', stage: 'admission', mandatory: true, gracePeriodDays: 30, enforcement: 'hard_block', verifier: 'registrar' },
            { name: 'Previous Marksheet', category: 'Academic', stage: 'admission', mandatory: true, gracePeriodDays: 0, enforcement: 'hard_block', verifier: 'admin' },
            { name: 'Residence Proof', category: 'Address', stage: 'admission', mandatory: true, gracePeriodDays: 15, enforcement: 'soft_warning', verifier: 'admin' },
            { name: 'Transport Application', category: 'Optional', stage: 'post-admission', mandatory: false, gracePeriodDays: 5, enforcement: 'info_only', verifier: 'admin' },
            { name: 'Medical Fitness Certificate', category: 'Health', stage: 'joining', mandatory: false, gracePeriodDays: 10, enforcement: 'soft_warning', verifier: 'admin' }
        ];
        const defaultStaffRules = [
            { name: 'Identity Proof (PAN/Aadhaar)', category: 'Identity', type: 'all', stage: 'joining', mandatory: true, gracePeriodDays: 7, enforcement: 'hard_block' },
            { name: 'Qualification Degrees', category: 'Academic', type: 'teaching', stage: 'joining', mandatory: true, gracePeriodDays: 0, enforcement: 'hard_block' },
            { name: 'Experience Letters', category: 'Professional', type: 'teaching', stage: 'interview', mandatory: true, gracePeriodDays: 0, enforcement: 'soft_warning' },
            { name: 'Police Verification', category: 'Legal', type: 'all', stage: 'joining', mandatory: true, gracePeriodDays: 45, enforcement: 'hard_block' }
        ];
        if (branchId === 'main' || branchId.length !== 24) {
            return res.status(200).json({
                success: true,
                message: "No specific configuration for this branch level, providing defaults",
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
                    provisionalAdmission: defaultGovernance.provisionalAdmission,
                    overrideRoles: defaultGovernance.overrideRoles,
                    studentRules: defaultStudentRules,
                    staffRules: defaultStaffRules
                }
            });
        }

        let rule = await DocumentRule.findOne({ instituteId, branchId });

        if (!rule) {
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
                    provisionalAdmission: defaultGovernance.provisionalAdmission,
                    overrideRoles: defaultGovernance.overrideRoles,
                    studentRules: defaultStudentRules,
                    staffRules: defaultStaffRules
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
        const instituteId = req.user.instituteId || req.user._id;

        if (!branchId || branchId === 'main') {
            return res.status(400).json({ success: false, message: "A valid Branch ID is required to save document policy" });
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

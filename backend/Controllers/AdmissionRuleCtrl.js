import AdmissionRule from "../Models/AdmissionRuleModel.js";

// ================= GET OR INITIALIZE ADMISSION RULE =================
export const getAdmissionRule = async (req, res) => {
    try {
        const { academicYearId } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        if (!academicYearId) {
            return res.status(400).json({ success: false, message: "Academic Year is required" });
        }

        let rule = await AdmissionRule.findOne({ instituteId, academicYearId });

        if (!rule) {
            // Provide defaults if no policy found
            return res.status(200).json({
                success: true,
                message: "No policy found, providing defaults",
                data: {
                    academicYearId,
                    window: { isOpen: true, allowLate: false },
                    seatCapacity: { strictCapacity: true, waitlistEnabled: true, autoPromoteWaitlist: false },
                    workflow: { requireFee: true, requireDocs: true, approval: 'admin' },
                    eligibility: []
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

// ================= SAVE ADMISSION RULE =================
export const saveAdmissionRule = async (req, res) => {
    try {
        const { academicYearId, ...ruleData } = req.body;
        const instituteId = req.user._id;

        if (!academicYearId) {
            return res.status(400).json({ success: false, message: "Academic Year is required" });
        }

        const existing = await AdmissionRule.findOne({ instituteId, academicYearId });
        if (existing && existing.isLocked && !req.body.unlockReason) {
            return res.status(403).json({
                success: false,
                message: "Admission policy is locked. Provide an audit reason to modify."
            });
        }

        const rule = await AdmissionRule.findOneAndUpdate(
            { instituteId, academicYearId },
            {
                $set: {
                    ...ruleData,
                    instituteId,
                    academicYearId
                }
            },
            { upsert: true, new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Admission policy saved successfully",
            data: rule,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= LOCK / UNLOCK ADMISSION RULE =================
export const toggleAdmissionLock = async (req, res) => {
    try {
        const { id } = req.params;
        const { isLocked, unlockReason } = req.body;

        const rule = await AdmissionRule.findById(id);
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
            message: `Admission policy ${isLocked ? 'Locked' : 'Unlocked'} successfully`,
            data: rule
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

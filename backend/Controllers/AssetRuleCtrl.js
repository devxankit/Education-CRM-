import AssetRule from "../Models/AssetRuleModel.js";

// ================= GET OR INITIALIZE ASSET RULE =================
export const getAssetRule = async (req, res) => {
    try {
        const { branchId } = req.query;
        const instituteId = req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }

        let rule = await AssetRule.findOne({ instituteId, branchId });

        if (!rule) {
            // Return defaults if none exists
            return res.status(200).json({
                success: true,
                message: "No configuration found, providing defaults",
                data: {
                    branchId,
                    inventory: { trackingEnabled: true, lowStockThreshold: 10, autoBlockIssue: true },
                    assignment: { allowStaff: true, allowDepartment: true, allowLocation: true, approvalRequired: true, mandatoryReturn: true },
                    audit: { periodicAudit: true, frequency: 'quarterly', physicalVerification: true, retentionYears: 5 }
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

// ================= SAVE ASSET RULE =================
export const saveAssetRule = async (req, res) => {
    try {
        const { branchId, ...ruleData } = req.body;
        const instituteId = req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }

        const existing = await AssetRule.findOne({ instituteId, branchId });
        if (existing && existing.isLocked && !req.body.unlockReason) {
            return res.status(403).json({
                success: false,
                message: "Asset governance policy is locked. Provide an audit reason to modify."
            });
        }

        const rule = await AssetRule.findOneAndUpdate(
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
            message: "Asset policy saved successfully",
            data: rule,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= LOCK / UNLOCK ASSET RULE =================
export const toggleAssetLock = async (req, res) => {
    try {
        const { id } = req.params;
        const { isLocked, unlockReason } = req.body;

        const rule = await AssetRule.findById(id);
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
            message: `Asset policy ${isLocked ? 'Locked' : 'Unlocked'} successfully`,
            data: rule
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

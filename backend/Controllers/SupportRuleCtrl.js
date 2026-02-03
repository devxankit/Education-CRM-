import SupportRule from "../Models/SupportRuleModel.js";

// ================= GET OR INITIALIZE SUPPORT RULE =================
export const getSupportRule = async (req, res) => {
    try {
        const { branchId } = req.query;
        const instituteId = req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }

        let rule = await SupportRule.findOne({ instituteId, branchId });

        if (!rule) {
            // Return defaults if none exists
            return res.status(200).json({
                success: true,
                message: "No configuration found, providing defaults",
                data: {
                    branchId,
                    channels: [
                        { id: 'in_app', name: 'In-App Support', enabled: true, autoAck: true },
                        { id: 'email', name: 'Email Helpdesk', enabled: true, autoAck: true },
                        { id: 'whatsapp', name: 'WhatsApp Bot', enabled: false, autoAck: false }
                    ],
                    categories: [
                        { name: 'Academic Issues', priority: 'medium', active: true },
                        { name: 'Fee & Billing', priority: 'high', active: true },
                        { name: 'Transport', priority: 'medium', active: true },
                        { name: 'Technical Support', priority: 'low', active: true },
                        { name: 'Emergency / Safety', priority: 'critical', active: true }
                    ],
                    sla: [
                        { priority: 'critical', response: 0.5, resolution: 4 },
                        { priority: 'high', response: 2, resolution: 12 },
                        { priority: 'medium', response: 6, resolution: 24 },
                        { priority: 'low', response: 24, resolution: 72 }
                    ],
                    escalation: { escalationEnabled: true, autoBreachEscalation: true }
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

// ================= SAVE SUPPORT RULE =================
export const saveSupportRule = async (req, res) => {
    try {
        const { branchId, ...ruleData } = req.body;
        const instituteId = req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }

        const existing = await SupportRule.findOne({ instituteId, branchId });
        if (existing && existing.isLocked && !req.body.unlockReason) {
            return res.status(403).json({
                success: false,
                message: "Support policy is locked. Provide an audit reason to modify."
            });
        }

        const rule = await SupportRule.findOneAndUpdate(
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
            message: "Support policy saved successfully",
            data: rule,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= LOCK / UNLOCK SUPPORT RULE =================
export const toggleSupportLock = async (req, res) => {
    try {
        const { id } = req.params;
        const { isLocked, unlockReason } = req.body;

        const rule = await SupportRule.findById(id);
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
            message: `Support policy ${isLocked ? 'Locked' : 'Unlocked'} successfully`,
            data: rule
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

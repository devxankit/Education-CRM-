import PayrollRule from "../Models/PayrollRuleModel.js";

// ================= GET OR INITIALIZE PAYROLL RULE =================
export const getPayrollRule = async (req, res) => {
    try {
        const { financialYear } = req.query;
        const instituteId = req.user._id;

        if (!financialYear) {
            return res.status(400).json({ success: false, message: "Financial Year is required" });
        }

        let rule = await PayrollRule.findOne({ instituteId, financialYear });

        // Fallback defaults if not found
        if (!rule) {
            return res.status(200).json({
                success: true,
                message: "No configuration found, providing defaults",
                data: {
                    financialYear,
                    salaryHeads: [
                        { name: 'Basic Salary', type: 'earning', calculation: 'fixed', value: 0, isDefault: true },
                        { name: 'HRA (House Rent)', type: 'earning', calculation: 'percentage', value: 40, base: 'basic' },
                        { name: 'Provident Fund (PF)', type: 'deduction', calculation: 'percentage', value: 12, base: 'basic' }
                    ],
                    leaveRules: { lopFormula: 'fixed_30', sandwichRule: false, includeWeekends: true },
                    schedule: { cycleStart: 1, payoutDay: 5, autoGenerateSlips: false }
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

// ================= SAVE PAYROLL RULE =================
export const savePayrollRule = async (req, res) => {
    try {
        const { financialYear, ...ruleData } = req.body;
        const instituteId = req.user._id;

        if (!financialYear) {
            return res.status(400).json({ success: false, message: "Financial Year is required" });
        }

        // Check lock status
        const existing = await PayrollRule.findOne({ instituteId, financialYear });
        if (existing && existing.isLocked && !req.body.unlockReason) {
            return res.status(403).json({
                success: false,
                message: "Payroll configuration is locked. Provide an audit reason to modify."
            });
        }

        const rule = await PayrollRule.findOneAndUpdate(
            { instituteId, financialYear },
            {
                $set: {
                    ...ruleData,
                    instituteId,
                    financialYear
                }
            },
            { upsert: true, new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Payroll configuration saved successfully",
            data: rule,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= LOCK / UNLOCK PAYROLL RULE =================
export const togglePayrollLock = async (req, res) => {
    try {
        const { id } = req.params;
        const { isLocked, unlockReason } = req.body;

        const rule = await PayrollRule.findById(id);
        if (!rule) {
            return res.status(404).json({ success: false, message: "Configuration not found" });
        }

        rule.isLocked = isLocked;
        if (!isLocked && unlockReason) {
            rule.unlockReason = unlockReason;
        }

        await rule.save();

        res.status(200).json({
            success: true,
            message: `Payroll config ${isLocked ? 'Locked' : 'Unlocked'} successfully`,
            data: rule
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

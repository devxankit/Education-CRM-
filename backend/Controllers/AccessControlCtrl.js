import AccessControl from "../Models/AccessControlModel.js";

// ================= GET ACCESS CONTROL POLICIES =================
export const getAccessControlPolicies = async (req, res) => {
    try {
        const instituteId = req.user._id;
        let policies = await AccessControl.findOne({ instituteId });

        // If no policies exist yet, create default policies for this institute
        if (!policies) {
            policies = new AccessControl({ instituteId });
            await policies.save();
        }

        res.status(200).json({
            success: true,
            data: policies,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= UPDATE ACCESS CONTROL POLICIES =================
export const updateAccessControlPolicies = async (req, res) => {
    try {
        const instituteId = req.user._id;
        const allowed = ['force2FA', 'sessionTimeout', 'maxLoginAttempts', 'lockoutMinutes', 'ipWhitelistEnabled', 'ipWhitelist', 'passwordExpiryDays'];
        const updateData = {};
        allowed.forEach(key => {
            if (req.body[key] !== undefined) {
                if (['maxLoginAttempts', 'lockoutMinutes', 'sessionTimeout', 'passwordExpiryDays'].includes(key)) {
                    const defs = { sessionTimeout: 30, maxLoginAttempts: 3, lockoutMinutes: 15, passwordExpiryDays: 90 };
                    updateData[key] = Number(req.body[key]) || defs[key];
                } else {
                    updateData[key] = req.body[key];
                }
            }
        });

        const policies = await AccessControl.findOneAndUpdate(
            { instituteId },
            { $set: updateData },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Access control policies updated successfully",
            data: policies,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

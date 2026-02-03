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
        const updateData = req.body;

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

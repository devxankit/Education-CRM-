import FeePolicy from "../Models/FeePolicyModel.js";
import mongoose from "mongoose";

// ================= GET OR INITIALIZE POLICY =================
export const getFeePolicy = async (req, res) => {
    try {
        const { academicYearId } = req.query;
        const instituteId = req.user._id;

        if (!academicYearId || !mongoose.Types.ObjectId.isValid(academicYearId)) {
            return res.status(400).json({ success: false, message: "Valid Academic Year ID is required" });
        }

        let policy = await FeePolicy.findOne({ instituteId, academicYearId });

        // If no policy exists for this year, return a default template (or create one)
        if (!policy) {
            return res.status(200).json({
                success: true,
                message: "No policy found, providing empty template",
                data: {
                    academicYearId,
                    installmentRules: { allowPartial: true, allowOutOfOrder: false, strictDueDate: true, blockResultsOnDue: true },
                    lateFeeRules: { enabled: false, gracePeriod: 0, type: "flat", value: 0, frequency: "daily", maxCap: 0 },
                    discountRules: [],
                    refundRules: { allowed: false, windowDays: 0, deductionPercent: 0 }
                }
            });
        }

        res.status(200).json({
            success: true,
            data: policy,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= SAVE / UPDATE POLICY =================
export const saveFeePolicy = async (req, res) => {
    try {
        const { academicYearId, ...policyData } = req.body;
        const instituteId = req.user._id;

        if (!academicYearId || !mongoose.Types.ObjectId.isValid(academicYearId)) {
            return res.status(400).json({ success: false, message: "Valid Academic Year ID is required" });
        }

        // Check if currently locked
        const existing = await FeePolicy.findOne({ instituteId, academicYearId });
        if (existing && existing.isLocked && !req.body.unlockReason) {
            return res.status(403).json({
                success: false,
                message: "This policy is locked and cannot be modified without an audit reason."
            });
        }

        // Remove _id from nested objects if they are present as 'id' from frontend
        if (policyData.discountRules) {
            policyData.discountRules = policyData.discountRules.map(d => {
                const { id, ...rest } = d;
                return rest;
            });
        }

        const policy = await FeePolicy.findOneAndUpdate(
            { instituteId, academicYearId },
            {
                $set: {
                    ...policyData,
                    instituteId,
                    academicYearId
                }
            },
            { upsert: true, new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Fee policy saved successfully",
            data: policy,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= LOCK / UNLOCK POLICY =================
export const togglePolicyLock = async (req, res) => {
    try {
        const { id } = req.params;
        const { isLocked, unlockReason } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Policy ID" });
        }

        const policy = await FeePolicy.findById(id);
        if (!policy) {
            return res.status(404).json({ success: false, message: "Policy not found" });
        }

        policy.isLocked = isLocked;
        if (!isLocked && unlockReason) {
            policy.unlockReason = unlockReason;
        }

        await policy.save();

        res.status(200).json({
            success: true,
            message: `Policy ${isLocked ? 'Locked' : 'Unlocked'} successfully`,
            data: policy
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

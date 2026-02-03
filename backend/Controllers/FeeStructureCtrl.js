import FeeStructure from "../Models/FeeStructureModel.js";
import mongoose from "mongoose";

// ================= CREATE FEE STRUCTURE =================
export const createFeeStructure = async (req, res) => {
    try {
        const {
            name, academicYearId, branchId, totalAmount,
            applicableClasses, applicableCourses, components, installments
        } = req.body;
        const instituteId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(branchId)) {
            return res.status(400).json({ success: false, message: "Invalid Branch ID" });
        }
        if (!mongoose.Types.ObjectId.isValid(academicYearId)) {
            return res.status(400).json({ success: false, message: "Invalid Academic Year ID" });
        }

        const feeStructure = new FeeStructure({
            instituteId,
            branchId,
            academicYearId,
            name,
            totalAmount,
            applicableClasses: applicableClasses || [],
            applicableCourses: applicableCourses || [],
            components: components || [],
            installments: installments || [],
            status: "draft"
        });

        await feeStructure.save();

        res.status(201).json({
            success: true,
            message: "Fee structure created successfully",
            data: feeStructure,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET ALL FEE STRUCTURES =================
export const getFeeStructures = async (req, res) => {
    try {
        const { branchId, academicYearId, status } = req.query;
        const instituteId = req.user._id;

        let query = { instituteId };

        if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
            query.branchId = branchId;
        } else if (branchId && branchId !== 'main') {
            // If branchId is provided but invalid, and not the fallback 'main', maybe return error or empty?
            // For now, if it's 'main', we'll just not filter by branchId if it's not a valid ID.
            // But the model says branchId is required, so structures MUST have one.
            // If we don't filter by branchId, we might see structures from other branches.
        }

        if (academicYearId && mongoose.Types.ObjectId.isValid(academicYearId)) {
            query.academicYearId = academicYearId;
        }

        if (status) query.status = status;

        const feeStructures = await FeeStructure.find(query)
            .populate("academicYearId", "name")
            .populate("applicableClasses", "name")
            .populate("applicableCourses", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: feeStructures,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE FEE STRUCTURE =================
export const updateFeeStructure = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // If locking/activating
        if (updateData.status === "active") {
            const structure = await FeeStructure.findById(id);
            if (structure.totalAmount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot activate structure with zero total amount"
                });
            }
        }

        const feeStructure = await FeeStructure.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!feeStructure) {
            return res.status(404).json({ success: false, message: "Fee structure not found" });
        }

        res.status(200).json({
            success: true,
            message: "Fee structure updated successfully",
            data: feeStructure,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE FEE STRUCTURE =================
export const deleteFeeStructure = async (req, res) => {
    try {
        const { id } = req.params;

        // Only allow deleting draft structures?
        const structure = await FeeStructure.findById(id);
        if (!structure) {
            return res.status(404).json({ success: false, message: "Fee structure not found" });
        }

        if (structure.status === "active") {
            return res.status(400).json({
                success: false,
                message: "Cannot delete an active fee structure. Archive it instead."
            });
        }

        await FeeStructure.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Fee structure deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

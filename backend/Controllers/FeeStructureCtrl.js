import FeeStructure from "../Models/FeeStructureModel.js";
import mongoose from "mongoose";

// ================= CREATE FEE STRUCTURE =================
export const createFeeStructure = async (req, res) => {
    try {
        const {
            name, academicYearId, branchId, totalAmount,
            applicableClasses, applicableCourses, components, installments, status
        } = req.body;
        const instituteId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(branchId)) {
            return res.status(400).json({ success: false, message: "Invalid Branch ID" });
        }
        if (!mongoose.Types.ObjectId.isValid(academicYearId)) {
            return res.status(400).json({ success: false, message: "Invalid Academic Year ID" });
        }

        // Validation: Check for duplicate fee structure
        // Same branch + same academic year + overlapping classes cannot have multiple structures
        if (applicableClasses && applicableClasses.length > 0) {
            const existingStructures = await FeeStructure.find({
                instituteId,
                branchId,
                academicYearId,
                status: { $in: ['active', 'draft'] } // Only check active and draft
            }).populate('applicableClasses', '_id');

            for (const existing of existingStructures) {
                const existingClassIds = existing.applicableClasses?.map(c => c._id?.toString() || c.toString()) || [];
                const newClassIds = applicableClasses.map(c => c.toString());

                // Check if any class overlaps
                const hasOverlap = newClassIds.some(clsId => existingClassIds.includes(clsId));

                if (hasOverlap) {
                    return res.status(400).json({
                        success: false,
                        message: `A fee structure already exists for this branch, academic year, and class combination. Please edit the existing structure "${existing.name}" or select different classes.`
                    });
                }
            }
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
            status: status || "active" // Default to active, allow draft if explicitly set
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

        let query = { };

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
        const instituteId = req.user._id;

        const existingStructure = await FeeStructure.findById(id);
        if (!existingStructure) {
            return res.status(404).json({ success: false, message: "Fee structure not found" });
        }

        // Validation: Check for duplicate fee structure (if branch/year/classes are being updated)
        const branchId = updateData.branchId || existingStructure.branchId;
        const academicYearId = updateData.academicYearId || existingStructure.academicYearId;
        const applicableClasses = updateData.applicableClasses || existingStructure.applicableClasses;

        if (applicableClasses && applicableClasses.length > 0) {
            const duplicateStructures = await FeeStructure.find({
                _id: { $ne: id }, // Exclude current structure
                instituteId,
                branchId,
                academicYearId,
                status: { $in: ['active', 'draft'] }
            }).populate('applicableClasses', '_id');

            for (const duplicate of duplicateStructures) {
                const duplicateClassIds = duplicate.applicableClasses?.map(c => c._id?.toString() || c.toString()) || [];
                const newClassIds = applicableClasses.map(c => c.toString());

                const hasOverlap = newClassIds.some(clsId => duplicateClassIds.includes(clsId));

                if (hasOverlap) {
                    return res.status(400).json({
                        success: false,
                        message: `Cannot update: A fee structure "${duplicate.name}" already exists for this branch, academic year, and class combination.`
                    });
                }
            }
        }

        // If locking/activating
        if (updateData.status === "active") {
            if (existingStructure.totalAmount <= 0) {
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

import ExpenseCategory from "../Models/ExpenseCategoryModel.js";
import mongoose from "mongoose";

// ================= CREATE EXPENSE CATEGORY =================
export const createExpenseCategory = async (req, res) => {
    try {
        const { name, code, type, budgetLimit, approvalRequired, branchId } = req.body;
        const instituteId = req.user._id;

        if (!branchId || !mongoose.Types.ObjectId.isValid(branchId)) {
            return res.status(400).json({ success: false, message: "Valid Branch ID is required" });
        }

        const category = new ExpenseCategory({
            instituteId,
            branchId,
            name,
            code,
            type,
            budgetLimit,
            approvalRequired,
        });

        await category.save();

        res.status(201).json({
            success: true,
            message: "Expense category created successfully",
            data: category,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET EXPENSE CATEGORIES =================
export const getExpenseCategories = async (req, res) => {
    try {
        const { branchId, isActive } = req.query;
        const instituteId = req.user._id;

        let query = { instituteId };

        if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
            query.branchId = branchId;
        }

        if (isActive !== undefined) query.isActive = isActive === 'true';

        const categories = await ExpenseCategory.find(query).sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE EXPENSE CATEGORY =================
export const updateExpenseCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const category = await ExpenseCategory.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        res.status(200).json({
            success: true,
            message: "Expense category updated successfully",
            data: category,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE EXPENSE CATEGORY =================
export const deleteExpenseCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // In a real system, you might want to check if expenses are already linked
        const category = await ExpenseCategory.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        res.status(200).json({
            success: true,
            message: "Expense category deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

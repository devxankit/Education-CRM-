import Expense from "../Models/ExpenseModel.js";
import mongoose from "mongoose";
import { logFinancial, logUserActivity } from "../Helpers/logger.js";

// ================= GET EXPENSES =================
export const getExpenses = async (req, res) => {
    try {
        const { branchId, categoryId, status, month, year, startDate, endDate } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        let query = { instituteId };

        if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
            query.branchId = branchId;
        }
        if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
            query.categoryId = categoryId;
        }
        if (status) query.status = status;

        if (month && year) {
            const start = new Date(parseInt(year), parseInt(month) - 1, 1);
            const end = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
            query.expenseDate = { $gte: start, $lte: end };
        } else if (startDate && endDate) {
            query.expenseDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const expenses = await Expense.find(query)
            .populate("categoryId", "name code")
            .populate("branchId", "name")
            .sort({ expenseDate: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            data: expenses,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= CREATE EXPENSE =================
export const createExpense = async (req, res) => {
    try {
        const {
            branchId,
            categoryId,
            title,
            vendorName,
            amount,
            expenseDate,
            status,
            paymentMethod,
            transactionId,
            remarks,
            invoiceUrl,
        } = req.body;

        const instituteId = req.user.instituteId || req.user._id;
        const isStaff = req.role === "staff";

        if (!branchId || !title || amount === undefined || amount === null) {
            return res.status(400).json({
                success: false,
                message: "branchId, title and amount are required",
            });
        }

        const expense = new Expense({
            instituteId,
            branchId,
            categoryId: categoryId || undefined,
            title,
            vendorName: vendorName || "",
            amount: Number(amount),
            expenseDate: expenseDate ? new Date(expenseDate) : new Date(),
            status: status || "Pending",
            paymentMethod: paymentMethod || undefined,
            transactionId: transactionId || undefined,
            remarks: remarks || "",
            invoiceUrl: invoiceUrl || undefined,
            createdBy: req.user._id,
            createdByModel: isStaff ? "Staff" : "Institute",
        });

        await expense.save();
        await expense.populate("categoryId", "name code");
        await expense.populate("branchId", "name");

        logFinancial(req, { branchId, type: "expense", amount: Number(amount), referenceType: "Expense", referenceId: expense._id, description: `Expense: ${title} - ₹${Number(amount)}` });
        logUserActivity(req, { branchId, action: "expense_added", entityType: "Expense", entityId: expense._id, description: `Expense "${title}" ₹${Number(amount)} added` });

        res.status(201).json({
            success: true,
            message: "Expense recorded successfully",
            data: expense,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET SINGLE EXPENSE =================
export const getExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findById(id)
            .populate("categoryId", "name code")
            .populate("branchId", "name");

        if (!expense) {
            return res.status(404).json({ success: false, message: "Expense not found" });
        }

        res.status(200).json({
            success: true,
            data: expense,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE EXPENSE =================
export const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const allowed = [
            "categoryId",
            "title",
            "vendorName",
            "amount",
            "expenseDate",
            "status",
            "paymentMethod",
            "transactionId",
            "remarks",
            "invoiceUrl",
        ];
        const filtered = {};
        allowed.forEach((k) => {
            if (updateData[k] !== undefined) filtered[k] = updateData[k];
        });
        if (filtered.expenseDate) filtered.expenseDate = new Date(filtered.expenseDate);
        if (filtered.amount !== undefined) filtered.amount = Number(filtered.amount);

        const expense = await Expense.findByIdAndUpdate(
            id,
            { $set: filtered },
            { new: true, runValidators: true }
        )
            .populate("categoryId", "name code")
            .populate("branchId", "name");

        if (!expense) {
            return res.status(404).json({ success: false, message: "Expense not found" });
        }

        res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            data: expense,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE EXPENSE =================
export const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findByIdAndDelete(id);

        if (!expense) {
            return res.status(404).json({ success: false, message: "Expense not found" });
        }

        res.status(200).json({
            success: true,
            message: "Expense deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ExpenseCategory",
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        vendorName: {
            type: String,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        expenseDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["Pending", "Paid"],
            default: "Pending",
        },
        paymentMethod: {
            type: String,
            enum: ["Cash", "Cheque", "Bank Transfer", "Online", "Other"],
        },
        transactionId: {
            type: String,
            trim: true,
        },
        remarks: {
            type: String,
            trim: true,
        },
        invoiceUrl: {
            type: String,
            trim: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "createdByModel",
        },
        createdByModel: {
            type: String,
            enum: ["Institute", "Staff"],
        },
    },
    { timestamps: true }
);

expenseSchema.index({ instituteId: 1, branchId: 1 });
expenseSchema.index({ expenseDate: -1 });
expenseSchema.index({ status: 1, expenseDate: -1 });

export default mongoose.model("Expense", expenseSchema);

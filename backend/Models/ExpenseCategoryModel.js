import mongoose from "mongoose";

const expenseCategorySchema = new mongoose.Schema(
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
        name: {
            type: String,
            required: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["fixed", "variable"],
            default: "variable",
        },
        budgetLimit: {
            type: Number,
            default: 0,
        },
        approvalRequired: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Unique category code per branch
expenseCategorySchema.index({ branchId: 1, code: 1 }, { unique: true });

export default mongoose.model("ExpenseCategory", expenseCategorySchema);

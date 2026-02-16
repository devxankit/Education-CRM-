import mongoose from "mongoose";

/**
 * Financial Logs
 * Isme paiso se related sari entries record hoti hain.
 * Example: ₹5000 fee receive hua, ₹2000 refund, ₹10000 salary transfer.
 */
const financialLogSchema = new mongoose.Schema(
    {
        instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute", required: true },
        branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
        type: {
            type: String,
            required: true,
            enum: [
                "fee_payment",
                "fee_refund",
                "salary_transfer",
                "expense",
                "expense_refund",
                "other_income",
                "other_expense"
            ]
        },
        amount: { type: Number, required: true },
        currency: { type: String, default: "INR" },
        referenceType: { type: String }, // FeePayment, Payroll, Expense
        referenceId: { type: mongoose.Schema.Types.ObjectId },
        description: { type: String },
        performedBy: { type: mongoose.Schema.Types.ObjectId, refPath: "performedByModel" },
        performedByModel: { type: String, enum: ["Institute", "Staff", "Teacher"] },
        metadata: { type: mongoose.Schema.Types.Mixed }
    },
    { timestamps: true }
);

financialLogSchema.index({ instituteId: 1, createdAt: -1 });
financialLogSchema.index({ branchId: 1, createdAt: -1 });
financialLogSchema.index({ type: 1, createdAt: -1 });

export default mongoose.model("FinancialLog", financialLogSchema);

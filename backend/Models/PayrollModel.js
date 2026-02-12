import mongoose from "mongoose";

const salaryComponentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["earning", "deduction"], required: true },
    amount: { type: Number, required: true },
    calculation: { type: String, enum: ["fixed", "percentage"], required: true },
    base: { type: String, default: "basic" } // only for percentage
});

const payrollSchema = new mongoose.Schema(
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
        employeeType: {
            type: String,
            enum: ["teacher", "staff"],
            required: true,
        },
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'employeeTypeModel'
        },
        employeeTypeModel: {
            type: String,
            enum: ["Teacher", "Staff"],
            required: true,
        },
        financialYear: {
            type: String,
            required: true,
        },
        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12,
        },
        year: {
            type: Number,
            required: true,
        },
        basicSalary: {
            type: Number,
            required: true,
        },
        components: [salaryComponentSchema],
        totalEarnings: {
            type: Number,
            default: 0,
        },
        totalDeductions: {
            type: Number,
            default: 0,
        },
        netSalary: {
            type: Number,
            required: true,
        },
        // Attendance Details
        workingDays: {
            type: Number,
            default: 26, // Default working days in a month
        },
        presentDays: {
            type: Number,
            default: 0,
        },
        leaveDays: {
            type: Number,
            default: 0,
        },
        lopAmount: {
            type: Number,
            default: 0,
        },
        // Payment Details
        status: {
            type: String,
            enum: ["draft", "approved", "paid", "cancelled"],
            default: "draft",
        },
        paymentDate: {
            type: Date,
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "bank_transfer", "cheque", "neft", "rtgs", "upi"],
        },
        transactionId: {
            type: String,
        },
        // Bank Details (from employee, but can be overridden)
        bankAccountNumber: {
            type: String,
        },
        ifscCode: {
            type: String,
        },
        remarks: {
            type: String,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
        },
    },
    { timestamps: true }
);

// Index for unique payroll per employee per month/year
payrollSchema.index({ employeeId: 1, employeeType: 1, month: 1, year: 1, financialYear: 1 }, { unique: true });

// Index for filtering
payrollSchema.index({ instituteId: 1, branchId: 1, employeeType: 1, status: 1 });
payrollSchema.index({ financialYear: 1, month: 1, year: 1 });

export default mongoose.model("Payroll", payrollSchema);

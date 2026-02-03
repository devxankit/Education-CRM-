import mongoose from "mongoose";

const feeComponentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    frequency: {
        type: String,
        enum: ["Annual", "Term", "Monthly"],
        default: "Annual"
    },
    isMandatory: { type: Boolean, default: true }
});

const installmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dueDate: { type: Date },
    amount: { type: Number, required: true }
});

const feeStructureSchema = new mongoose.Schema(
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
        academicYearId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AcademicYear",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        // Can be linked to specific classes or courses
        applicableClasses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Class",
            }
        ],
        applicableCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            }
        ],
        status: {
            type: String,
            enum: ["draft", "active", "archived"],
            default: "draft",
        },
        components: [feeComponentSchema],
        installments: [installmentSchema],
    },
    { timestamps: true }
);

export default mongoose.model("FeeStructure", feeStructureSchema);

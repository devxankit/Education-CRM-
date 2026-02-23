import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema(
    {
        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },
        branchId: {
            type: String,
            default: "all"
        },
        academicYearId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AcademicYear",
            default: null
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["academic", "exam", "staff", "restricted"],
            default: "academic",
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        isRange: {
            type: Boolean,
            default: false,
        },
        applicableTo: {
            type: [String],
            enum: ["students", "teachers", "staff"],
            default: ["students", "teachers", "staff"],
        },
        description: {
            type: String,
            trim: true,
        }
    },
    { timestamps: true }
);

export default mongoose.model("Holiday", holidaySchema);

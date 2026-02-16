import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
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
            default: null,
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
            type: String, // e.g., UG, PG, Diploma
            required: true,
        },
        duration: {
            type: Number, // In years
            required: true,
        },
        totalSemesters: {
            type: Number,
            required: true,
        },
        creditSystem: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["active", "archived"],
            default: "active",
        },
    },
    { timestamps: true }
);

// Unique code per branch
courseSchema.index({ branchId: 1, code: 1 }, { unique: true });

export default mongoose.model("Course", courseSchema);

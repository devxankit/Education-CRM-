import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
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
        level: {
            type: String,
            enum: ["primary", "secondary", "senior_secondary", "ug"],
            required: true,
        },
        board: {
            type: String,
            enum: ["CBSE", "ICSE", "STATE", "IB", "IGCSE"],
            required: true,
        },
        capacity: {
            type: Number,
            default: 40,
        },
        status: {
            type: String,
            enum: ["active", "archived"],
            default: "active",
        },
    },
    { timestamps: true }
);

// Unique class name per branch per academic year (or branch-only for legacy)
classSchema.index({ branchId: 1, academicYearId: 1, name: 1 }, { unique: true, sparse: true });

export default mongoose.model("Class", classSchema);

import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
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
            enum: ["theory", "practical", "theory_practical"],
            default: "theory",
        },
        category: {
            type: String,
            enum: ["core", "elective", "vocational"],
            default: "core",
        },
        level: {
            type: String,
            enum: ["school", "ug", "pg"],
            default: "school",
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        classIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Class",
            },
        ],
        courseIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],
    },
    { timestamps: true }
);

// Unique code per branch
subjectSchema.index({ branchId: 1, code: 1 }, { unique: true });

export default mongoose.model("Subject", subjectSchema);

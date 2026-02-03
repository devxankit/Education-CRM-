import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
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
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        capacity: {
            type: Number,
            default: 40,
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    { timestamps: true }
);

// Compound index for unique section name per class
sectionSchema.index({ classId: 1, name: 1 }, { unique: true });

export default mongoose.model("Section", sectionSchema);

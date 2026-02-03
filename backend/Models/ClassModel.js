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
        status: {
            type: String,
            enum: ["active", "archived"],
            default: "active",
        },
    },
    { timestamps: true }
);

// Compound index for unique class name per branch
classSchema.index({ branchId: 1, name: 1 }, { unique: true });

export default mongoose.model("Class", classSchema);

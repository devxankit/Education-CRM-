import mongoose from "mongoose";

const taxSchema = new mongoose.Schema(
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
        description: {
            type: String,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
        },
        rate: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: ["percentage", "flat"],
            default: "percentage",
        },
        applicableOn: {
            type: String,
            enum: ["fees", "transport", "admission", "hostel", "all"],
            default: "fees",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Unique tax code per branch
taxSchema.index({ branchId: 1, code: 1 }, { unique: true });

export default mongoose.model("Tax", taxSchema);

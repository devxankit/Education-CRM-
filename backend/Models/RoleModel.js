import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
    {
        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
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
        description: {
            type: String,
        },
        permissions: {
            type: mongoose.Schema.Types.Mixed, // Storing permissions as an object/array
            default: {},
        },
        type: {
            type: String,
            enum: ["system", "custom"],
            default: "custom",
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    { timestamps: true }
);

// Compound index to ensure unique role codes per institute
roleSchema.index({ instituteId: 1, code: 1 }, { unique: true });

export default mongoose.model("Role", roleSchema);

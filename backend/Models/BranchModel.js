import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["school", "college", "training_center"],
            default: "school",
        },
        establishedYear: {
            type: Number,
        },
        address: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        phone: {
            type: String,
        },
        email: {
            type: String,
            lowercase: true,
        },
        allowAdmissions: {
            type: Boolean,
            default: true,
        },
        allowFeeCollection: {
            type: Boolean,
            default: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Branch", branchSchema);

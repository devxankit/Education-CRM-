import mongoose from "mongoose";

const assetCategorySchema = new mongoose.Schema(
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
            enum: ["Asset", "Consumable"],
            default: "Asset",
        },
        trackingType: {
            type: String,
            enum: ["Item-based", "Quantity-based"],
            default: "Item-based",
        },
        serialRequired: {
            type: Boolean,
            default: false,
        },
        depreciation: {
            type: Boolean,
            default: false,
        },
        depMethod: {
            type: String,
            enum: ["Straight Line", "Written Down Value", "None"],
            default: "None"
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        }
    },
    { timestamps: true }
);

assetCategorySchema.index({ branchId: 1, code: 1 }, { unique: true });

export default mongoose.model("AssetCategory", assetCategorySchema);

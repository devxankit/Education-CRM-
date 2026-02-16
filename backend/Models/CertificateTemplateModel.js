import mongoose from "mongoose";

const certificateTemplateSchema = new mongoose.Schema(
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
        name: { type: String, required: true, trim: true },
        code: { type: String, trim: true },
        type: {
            type: String,
            enum: ["STUDENT", "EMPLOYEE"],
            default: "STUDENT",
        },
        category: { type: String, trim: true, default: "GENERAL" },
        version: { type: String, default: "1.0" },
        status: {
            type: String,
            enum: ["DRAFT", "ACTIVE", "ARCHIVED"],
            default: "DRAFT",
        },
        purpose: { type: String, trim: true },
        content: { type: String, default: "" },
        header: { type: Boolean, default: true },
        footer: { type: Boolean, default: true },
        orientation: {
            type: String,
            enum: ["PORTRAIT", "LANDSCAPE"],
            default: "PORTRAIT",
        },
        updatedBy: { type: String, trim: true },
    },
    { timestamps: true }
);

certificateTemplateSchema.index({ instituteId: 1, branchId: 1 });

export default mongoose.model("CertificateTemplate", certificateTemplateSchema);

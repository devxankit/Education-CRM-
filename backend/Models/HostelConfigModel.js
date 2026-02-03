import mongoose from "mongoose";

const hostelConfigSchema = new mongoose.Schema(
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
        isLocked: {
            type: Boolean,
            default: false,
        },
        unlockReason: {
            type: String,
        },
        availability: {
            isEnabled: { type: Boolean, default: true },
            separateBlocks: {
                boys: { type: Boolean, default: true },
                girls: { type: Boolean, default: true },
                staff: { type: Boolean, default: false },
            },
            maxHostels: { type: Number, default: 2 },
        },
        roomRules: {
            roomTypes: {
                single: { type: Boolean, default: true },
                double: { type: Boolean, default: true },
                triple: { type: Boolean, default: false },
                dorm: { type: Boolean, default: false },
            },
            maxBedsPerRoom: { type: Number, default: 4 },
        },
        feeLink: {
            isLinked: { type: Boolean, default: true },
            feeBasis: { type: String, enum: ["room_type", "flat"], default: "room_type" },
            collectionFrequency: { type: String, enum: ["monthly", "term", "annual"], default: "term" },
        },
        safetyRules: {
            mandatoryGuardian: { type: Boolean, default: true },
            medicalInfo: { type: Boolean, default: true },
            wardenAssignment: { type: Boolean, default: true },
        },
    },
    { timestamps: true }
);

hostelConfigSchema.index({ branchId: 1 }, { unique: true });

export default mongoose.model("HostelConfig", hostelConfigSchema);

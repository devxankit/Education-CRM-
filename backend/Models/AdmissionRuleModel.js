import mongoose from "mongoose";

const eligibilitySchema = new mongoose.Schema({
    class: { type: String, required: true },
    minAge: { type: Number, default: 0 },
    maxAge: { type: Number, default: 0 },
    prevClassRequired: { type: Boolean, default: false }
});

const admissionRuleSchema = new mongoose.Schema(
    {
        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },
        academicYearId: {
            type: String, // Can be ID or String representation (e.g. "2025-26")
            required: true,
        },
        isLocked: {
            type: Boolean,
            default: false,
        },
        unlockReason: {
            type: String,
        },
        window: {
            isOpen: { type: Boolean, default: true },
            startDate: { type: Date },
            endDate: { type: Date },
            allowLate: { type: Boolean, default: false },
        },
        seatCapacity: {
            strictCapacity: { type: Boolean, default: true },
            waitlistEnabled: { type: Boolean, default: true },
            autoPromoteWaitlist: { type: Boolean, default: false },
        },
        workflow: {
            requireFee: { type: Boolean, default: true },
            requireDocs: { type: Boolean, default: true },
            approval: {
                type: String,
                enum: ["admin", "principal", "director"],
                default: "admin"
            },
        },
        eligibility: [eligibilitySchema],
    },
    { timestamps: true }
);

admissionRuleSchema.index({ instituteId: 1, academicYearId: 1 }, { unique: true });

export default mongoose.model("AdmissionRule", admissionRuleSchema);

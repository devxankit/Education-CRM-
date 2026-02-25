import mongoose from "mongoose";

const transportDriverSchema = new mongoose.Schema(
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
        academicYearId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AcademicYear",
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        mobile: {
            type: String,
            required: true,
            trim: true,
        },
        licenseNo: {
            type: String,
            trim: true,
        },
        remarks: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

transportDriverSchema.index({ instituteId: 1, branchId: 1 });

export default mongoose.model("TransportDriver", transportDriverSchema);


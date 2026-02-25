import mongoose from "mongoose";

const transportVehicleSchema = new mongoose.Schema(
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
        code: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },
        registrationNo: {
            type: String,
            required: true,
            trim: true,
        },
        model: {
            type: String,
            required: true,
            trim: true,
        },
        capacity: {
            type: Number,
            default: 40,
        },
        remarks: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

transportVehicleSchema.index({ instituteId: 1, branchId: 1 });

export default mongoose.model("TransportVehicle", transportVehicleSchema);


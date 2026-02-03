import mongoose from "mongoose";

const stopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pickupTime: { type: String }, // formatted as HH:mm
    dropTime: { type: String }, // formatted as HH:mm
    students: { type: Number, default: 0 }
});

const transportRouteSchema = new mongoose.Schema(
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
        vehicleNo: {
            type: String,
            trim: true,
        },
        driver: {
            type: String,
            trim: true,
        },
        capacity: {
            type: Number,
            default: 0,
        },
        studentsAssigned: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
        stops: [stopSchema],
    },
    { timestamps: true }
);

// Unique route code per branch
transportRouteSchema.index({ branchId: 1, code: 1 }, { unique: true });

export default mongoose.model("TransportRoute", transportRouteSchema);

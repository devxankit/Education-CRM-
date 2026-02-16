import mongoose from "mongoose";

const academicYearSchema = new mongoose.Schema(
    {
        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
            default: null,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["upcoming", "active", "closed"],
            default: "upcoming",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
        }
    },
    { timestamps: true }
);

export default mongoose.model("AcademicYear", academicYearSchema);

import mongoose from "mongoose";

const designationSchema = new mongoose.Schema({
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
    level: {
        type: Number,
        default: 1,
    },
    reportsTo: {
        type: String, // Can be another Designation Name or Role
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
    }
});

const departmentSchema = new mongoose.Schema(
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
            unique: true,
            uppercase: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["Academic", "Administrative", "Operations", "Other"],
            default: "Academic",
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
        designations: [designationSchema],
    },
    { timestamps: true }
);

// Composite unique index for branch and code
departmentSchema.index({ branchId: 1, code: 1 }, { unique: true });

export default mongoose.model("Department", departmentSchema);

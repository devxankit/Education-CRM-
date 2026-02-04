import mongoose from "mongoose";

const sequenceSchema = new mongoose.Schema({
    instituteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institute",
        required: true
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch"
    },
    type: {
        type: String,
        required: true,
        enum: ["admission", "staff", "teacher", "receipt"]
    },
    prefix: {
        type: String,
        default: "ADM"
    },
    year: {
        type: String,
        default: () => new Date().getFullYear().toString()
    },
    sequenceValue: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Ensure unique sequence per type, institute, and year
sequenceSchema.index({ instituteId: 1, type: 1, year: 1 }, { unique: true });

export default mongoose.model("Sequence", sequenceSchema);

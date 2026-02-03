import mongoose from "mongoose";

const checklistItemSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ["document", "checkbox", "date", "text"],
        default: "checkbox",
    },
    required: {
        type: Boolean,
        default: true,
    }
});

const checklistSchema = new mongoose.Schema(
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
        title: {
            type: String,
            required: true,
            trim: true,
        },
        targetRole: {
            type: String,
            enum: ["student", "teacher", "staff", "parent", "other"],
            default: "student",
        },
        description: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        items: [checklistItemSchema]
    },
    { timestamps: true }
);

export default mongoose.model("Checklist", checklistSchema);

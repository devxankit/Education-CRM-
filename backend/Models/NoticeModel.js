import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
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
            default: null,
        },
        noticeId: {
            type: String,
            unique: true,
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["GENERAL", "HOLIDAY", "EMERGENCY", "EVENT", "FEES", "EXAM", "ADMINISTRATION"],
            default: "GENERAL",
        },
        priority: {
            type: String,
            enum: ["NORMAL", "IMPORTANT", "URGENT"],
            default: "NORMAL",
        },
        audiences: [
            {
                type: String,
                enum: ["All Students", "All Teachers", "All Parents", "All Staff", "Specific Classes", "Specific Departments"],
            }
        ],
        // Granular Targeting
        targetClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
        targetSections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
        targetDepartments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],

        channels: [
            {
                type: String,
                enum: ["APP", "EMAIL", "SMS", "WEB"],
                default: ["APP"],
            }
        ],
        status: {
            type: String,
            enum: ["DRAFT", "PUBLISHED", "SCHEDULED", "EXPIRED"],
            default: "DRAFT",
        },
        publishDate: {
            type: Date,
            default: Date.now,
        },
        expiryDate: {
            type: Date,
        },
        ackRequired: {
            type: Boolean,
            default: false,
        },
        attachments: [
            {
                name: String,
                url: String,
                fileType: String,
            }
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff",
        },
        recipientsCount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

noticeSchema.index({ instituteId: 1, branchId: 1 });

export default mongoose.model("Notice", noticeSchema);

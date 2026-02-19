import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema(
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
            trim: true,
        },
        type: {
            type: String,
            enum: ["Boys", "Girls", "Staff"],
            required: true,
        },
        status: {
            type: String,
            enum: ["Active", "Inactive", "Maintenance"],
            default: "Active",
        },
        // Building Configuration
        buildings: [
            {
                name: { type: String, required: true },
                code: { type: String, required: true },
                totalFloors: { type: Number, required: true },
                wardenId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }, // Warden assigned to block
            }
        ],
        // Rooms (Embedded for simplicity, or ref if too many - assuming embedded for now as per "Add Hostel" context)
        // Actually, defining rooms might be too heavy for the creation form if there are 100s.
        // User said "Room Configuration" is part of the form. Usually creates a template or range.
        // But let's support individual room definitions if the form allows adding them one by one or by range.
        // For the schema, we can keep an array of rooms.
        rooms: [
            {
                number: { type: String, required: true },
                buildingCode: { type: String, required: true }, // Link to building
                floor: { type: Number, required: true },
                type: { type: String, enum: ["Single", "Double", "Triple", "Dormitory"], required: true },
                capacity: { type: Number, required: true },
                status: { type: String, enum: ["Available", "Occupied", "Maintenance"], default: "Available" },
                feeAmount: { type: Number } // Specific override if needed
            }
        ],
        // Fee Mapping
        feeConfig: {
            mode: { type: String, enum: ["Room Type", "Flat"], default: "Room Type" },
            feeHeadId: { type: String },
            courseFee: { type: Number }, // Flat/Default fee
            singleRoomFee: { type: Number, default: 0 },
            doubleRoomFee: { type: Number, default: 0 },
            tripleRoomFee: { type: Number, default: 0 },
            dormRoomFee: { type: Number, default: 0 },
            collectionFrequency: { type: String, default: "Term" }
        },
        // Safety & Compliance Snapshot
        safetyRules: {
            guardianMandatory: { type: Boolean, default: true },
            medicalRequired: { type: Boolean, default: true },
            wardenApprovalRequired: { type: Boolean, default: true },
            emergencyContact: { type: String }
        },
        // Facilities
        facilities: {
            mess: {
                enabled: { type: Boolean, default: false },
                cost: { type: Number, default: 0 }
            },
            wifi: {
                enabled: { type: Boolean, default: false },
                cost: { type: Number, default: 0 }
            },
            laundry: {
                enabled: { type: Boolean, default: false },
                cost: { type: Number, default: 0 }
            },
            powerBackup: {
                enabled: { type: Boolean, default: false },
                cost: { type: Number, default: 0 }
            },
            security: {
                enabled: { type: Boolean, default: false },
                cost: { type: Number, default: 0 }
            }
        },
        // Documents
        documents: {
            photos: [{ type: String }], // URLs
            rulesPdf: { type: String },
            inspectionCert: { type: String }
        }
    },
    { timestamps: true }
);

// Indexes (code already has unique: true in field definition - no duplicate index)
hostelSchema.index({ branchId: 1, type: 1 });

export default mongoose.model("Hostel", hostelSchema);

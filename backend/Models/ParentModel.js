import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const parentSchema = new mongoose.Schema(
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
            unique: true,
            uppercase: true,
            trim: true,
        },
        relationship: {
            type: String,
            enum: ["Father", "Mother", "Guardian"],
            default: "Father",
        },
        mobile: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
        },
        address: {
            type: String,
        },
        occupation: {
            type: String,
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
        lastLogin: {
            type: Date,
        },
        resetPasswordOtp: { type: String },
        resetPasswordOtpExpires: { type: Date },
    },
    { timestamps: true }
);

// Password hashing
parentSchema.pre("save", async function () {
    if (!this.password || !this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

parentSchema.methods.comparePassword = async function (password) {
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model("Parent", parentSchema);

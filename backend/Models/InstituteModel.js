import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const instituteSchema = new mongoose.Schema(
  {
    // Admin Info (for registration/login)
    adminName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    // Institute Identity (IdentitySection)
    legalName: {
      type: String,
    },
    shortName: {
      type: String,
    },
    type: {
      type: String,
      enum: ['school', 'college', 'university', 'coaching', 'other'],
      default: 'school',
    },
    affiliations: {
      type: [String],
      default: [],
    },
    medium: {
      type: String,
      enum: ["english", "hindi", "regional", "Marathi", "Gujarati", "Other"],
      default: "english",
    },

    // Legal & Compliance (LegalDetailsSection)
    registrationNumber: {
      type: String,
    },
    affiliationCode: {
      type: String,
    },
    panNumber: {
      type: String,
    },
    gstNumber: {
      type: String,
    },
    establishedYear: {
      type: String,
    },

    // Contact & Address (ContactSection)
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: String,
    },
    phone: {
      type: String,
    },
    website: {
      type: String,
    },

    // Branding – single logo (logoLight/logoDark kept for backward compat)
    logo: {
      type: String,
    },
    logoLight: { type: String },
    logoDark: { type: String },
    letterheadHeader: {
      type: String, // URL/Path
    },
    letterheadFooter: {
      type: String, // URL/Path
    },
    
    role: {
      type: String,
      default: "institute",
    },
  },
  { timestamps: true }
);

// Password hashing
instituteSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

instituteSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("Institute", instituteSchema);

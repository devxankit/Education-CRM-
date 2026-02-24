import Institute from "../Models/InstituteModel.js";
import { generateToken } from "../Helpers/generateToken.js";
import { uploadToCloudinary, uploadBase64ToCloudinary } from "../Helpers/cloudinaryHelper.js";
import { logSecurity, logUserActivity } from "../Helpers/logger.js";

// ================= REGISTER INSTITUTE =================
export const registerInstitute = async (req, res) => {
  try {
    const { adminName, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const existingInstitute = await Institute.findOne({ email });
    if (existingInstitute) {
      return res.status(400).json({
        success: false,
        message: "Institute with this email already exists",
      });
    }

    const institute = new Institute({
      adminName,
      email,
      password,
    });

    await institute.save();

    const token = generateToken(institute._id, "institute");

    res.status(201).json({
      success: true,
      message: "Institute registered successfully",
      data: institute,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= LOGIN INSTITUTE / SUPER ADMIN =================
export const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const institute = await Institute.findOne({ email });
    if (!institute) {
      logSecurity(req, { instituteId: null, identifier: email, action: "login_failed", success: false, message: "Institute not found" });
      return res.status(404).json({
        success: false,
        message: "Institute/SuperAdmin not found",
      });
    }

    const isMatch = await institute.comparePassword(password);
    if (!isMatch) {
      logSecurity(req, { instituteId: institute._id, identifier: email, action: "wrong_password", success: false, message: "Invalid credentials" });
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(institute._id, "institute");
    logSecurity(req, { instituteId: institute._id, userId: institute._id, userModel: "Institute", identifier: email, action: "login_success", success: true, message: "Login successful" });
    logUserActivity(req, { instituteId: institute._id, userId: institute._id, userModel: "Institute", userEmail: institute.email, userName: institute.adminName, action: "login", description: "Institute admin login" });

    const instituteData = institute.toObject();
    delete instituteData.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: instituteData,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET INSTITUTE DETAILS =================
export const getInstituteDetails = async (req, res) => {
  try {
    const id = req.user._id;
    const institute = await Institute.findById(id);

    if (!institute) {
      return res.status(404).json({
        success: false,
        message: "Institute not found",
      });
    }

    res.status(200).json({
      success: true,
      data: institute,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE INSTITUTE DETAILS =================
export const updateInstituteDetails = async (req, res) => {
  try {
    const id = req.user._id;
    const updateData = { ...req.body };

    // Prevention of updating sensitive or internal fields
    const fieldsToExclude = ['password', 'email', '_id', 'createdAt', 'updatedAt', '__v', 'role'];
    fieldsToExclude.forEach(field => delete updateData[field]);

    // Handle Branding Base64 uploads (single logo + letterhead)
    const brandingFields = ['logo', 'letterheadHeader', 'letterheadFooter'];
    for (const field of brandingFields) {
      if (updateData[field] && updateData[field].startsWith('data:')) {
        try {
          const imageUrl = await uploadBase64ToCloudinary(updateData[field], `institutes/${id}/branding`);
          updateData[field] = imageUrl;
          if (field === 'logo') updateData.logoLight = imageUrl;
        } catch (uploadError) {
          console.error(`Error uploading ${field} to Cloudinary:`, uploadError);
        }
      }
    }

    const institute = await Institute.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!institute) {
      return res.status(404).json({
        success: false,
        message: "Institute not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Institute updated successfully",
      data: institute,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE BRANDING (LOGOS & LETTERHEADS) =================
export const updateInstituteBranding = async (req, res) => {
  try {
    const id = req.user._id;
    const files = req.files;
    const updateData = {};

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    // Upload each provided file to Cloudinary
    const uploadPromises = Object.keys(files).map(async (key) => {
      const file = files[key][0];
      const imageUrl = await uploadToCloudinary(file.buffer, `institutes/${id}/branding`);
      updateData[key] = imageUrl;
    });

    await Promise.all(uploadPromises);
    if (updateData.logo) updateData.logoLight = updateData.logo;

    const institute = await Institute.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Branding updated successfully",
      data: institute,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= CHANGE INSTITUTE ADMIN PASSWORD =================
export const changeInstitutePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const id = req.user._id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    const institute = await Institute.findById(id).select("+password");
    if (!institute) {
      return res.status(404).json({
        success: false,
        message: "Institute not found",
      });
    }

    const isMatch = await institute.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid current password",
      });
    }

    institute.password = newPassword;
    await institute.save();

    logSecurity(req, {
      instituteId: institute._id,
      userId: institute._id,
      userModel: "Institute",
      identifier: institute.email,
      action: "password_change",
      success: true,
      message: "Institute admin password updated",
    });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

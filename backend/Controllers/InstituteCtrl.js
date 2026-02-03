import Institute from "../Models/InstituteModel.js";
import { generateToken } from "../Helpers/generateToken.js";
import { uploadToCloudinary, uploadBase64ToCloudinary } from "../Helpers/cloudinaryHelper.js";

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
      return res.status(404).json({
        success: false,
        message: "Institute/SuperAdmin not found",
      });
    }

    const isMatch = await institute.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(institute._id, "institute");

    res.status(200).json({
      success: true,
      message: "Login successful",
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

    // Handle Branding Base64 uploads
    const brandingFields = ['logoLight', 'logoDark', 'letterheadHeader', 'letterheadFooter'];
    for (const field of brandingFields) {
      if (updateData[field] && updateData[field].startsWith('data:')) {
        try {
          const imageUrl = await uploadBase64ToCloudinary(updateData[field], `institutes/${id}/branding`);
          updateData[field] = imageUrl;
        } catch (uploadError) {
          console.error(`Error uploading ${field} to Cloudinary:`, uploadError);
          // Optionally handle error or keep existing value
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

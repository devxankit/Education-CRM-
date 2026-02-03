import Institute from "../Models/InstituteModel.js";
import { generateToken } from "../Helpers/generateToken.js";

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

    const token = generateToken(institute._id);

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

    const token = generateToken(institute._id);

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
    const updateData = req.body;

    // Prevention of updating sensitive fields if necessary
    delete updateData.password;
    delete updateData.email;

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

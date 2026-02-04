import Staff from "../Models/StaffModel.js";
import { generateToken } from "../Helpers/generateToken.js";
import { generateRandomPassword } from "../Helpers/generateRandomPassword.js";
import { sendLoginCredentialsEmail } from "../Helpers/SendMail.js";

// ================= CREATE STAFF USER =================
export const createStaff = async (req, res) => {
    try {
        const { name, email, roleId, branchId, phone } = req.body;
        const instituteId = req.user._id;

        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) {
            return res.status(400).json({
                success: false,
                message: "Staff user with this email already exists",
            });
        }

        // Generate Random Password
        const generatedPassword = "123456"
        // const generatedPassword = generateRandomPassword();

        const staff = new Staff({
            instituteId,
            name,
            email,
            password: generatedPassword,
            roleId,
            branchId: branchId === 'all' ? null : branchId,
            phone
        });

        await staff.save();

        // Send Email with credentials
        // Use a background process or don't await if you don't want to block the response
        // but for now we'll just fire and forget or simple await
        sendLoginCredentialsEmail(email, generatedPassword, name, "Staff");

        res.status(201).json({
            success: true,
            message: "Staff user created successfully and credentials sent to email",
            data: {
                _id: staff._id,
                name: staff.name,
                email: staff.email,
                roleId: staff.roleId
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET ALL STAFF =================
export const getStaffList = async (req, res) => {
    try {
        const instituteId = req.user._id;
        const staff = await Staff.find({ instituteId })
            .populate('roleId', 'name code')
            .populate('branchId', 'name');

        res.status(200).json({
            success: true,
            data: staff,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= UPDATE STAFF =================
export const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Prevent direct password update through this route
        delete updateData.password;

        const staff = await Staff.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('roleId', 'name code');

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff user not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Staff user updated successfully",
            data: staff,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= DELETE STAFF =================
export const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        await Staff.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Staff user deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= STAFF LOGIN =================
export const loginStaff = async (req, res) => {
    try {
        const { email, password } = req.body;

        const staff = await Staff.findOne({ email }).populate('roleId');
        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff user not found",
            });
        }

        if (staff.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: `Your account is ${staff.status}. Please contact administrator.`
            });
        }

        const isMatch = await staff.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = generateToken(staff._id, "Staff");

        // Update last login
        staff.lastLogin = new Date();
        await staff.save();

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: staff,
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

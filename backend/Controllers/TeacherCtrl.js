import Teacher from "../Models/TeacherModel.js";
import { generateToken } from "../Helpers/generateToken.js";
import { generateRandomPassword } from "../Helpers/generateRandomPassword.js";
import { sendLoginCredentialsEmail } from "../Helpers/SendMail.js";

// ================= CREATE TEACHER =================
export const createTeacher = async (req, res) => {
    try {
        const {
            employeeId, firstName, lastName, email,
            password, phone, branchId, department,
            designation, roleId, experience, joiningDate,
            teachingStatus, status
        } = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        const existingTeacher = await Teacher.findOne({
            $or: [{ email }, { employeeId }]
        });

        if (existingTeacher) {
            return res.status(400).json({
                success: false,
                message: "Teacher with this email or Employee ID already exists"
            });
        }

        // Generate Random Password
        // const generatedPassword = generateRandomPassword();
        const generatedPassword = "123456"

        const teacher = new Teacher({
            instituteId,
            branchId,
            employeeId,
            firstName,
            lastName,
            email,
            password: generatedPassword,
            phone,
            department,
            designation,
            roleId,
            experience,
            joiningDate: joiningDate || new Date(),
            teachingStatus: teachingStatus || 'Active',
            status: status || 'active'
        });

        await teacher.save();

        // Send Email
        const fullName = `${firstName} ${lastName}`;
        sendLoginCredentialsEmail(email, generatedPassword, fullName, "Teacher");

        res.status(201).json({
            success: true,
            message: "Teacher added successfully and credentials sent to email",
            data: {
                _id: teacher._id,
                firstName: teacher.firstName,
                lastName: teacher.lastName,
                email: teacher.email,
                employeeId: teacher.employeeId
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET TEACHERS =================
export const getTeachers = async (req, res) => {
    try {
        const { branchId, department } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        let query = { instituteId };
        if (branchId) query.branchId = branchId;
        if (department) query.department = department;

        const teachers = await Teacher.find(query)
            .populate("roleId", "name")
            .sort({ firstName: 1 });

        res.status(200).json({
            success: true,
            data: teachers,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE TEACHER =================
export const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Prevent password update via this route
        delete updateData.password;

        const teacher = await Teacher.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        res.status(200).json({
            success: true,
            message: "Teacher profile updated successfully",
            data: teacher,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= TEACHER LOGIN =================
export const loginTeacher = async (req, res) => {
    try {
        const { email, password } = req.body;

        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        if (teacher.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: `Your account is ${teacher.status}`
            });
        }

        const isMatch = await teacher.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(teacher._id, "Teacher");

        teacher.lastLogin = new Date();
        await teacher.save();

        res.status(200).json({
            success: true,
            message: "Teacher login successful",
            data: {
                _id: teacher._id,
                firstName: teacher.firstName,
                lastName: teacher.lastName,
                email: teacher.email,
                role: "Teacher"
            },
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

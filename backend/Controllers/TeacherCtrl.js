import Teacher from "../Models/TeacherModel.js";
import { generateToken } from "../Helpers/generateToken.js";

// ================= CREATE TEACHER =================
export const createTeacher = async (req, res) => {
    try {
        const {
            employeeId, firstName, lastName, email,
            password, phone, branchId, department,
            designation, roleId
        } = req.body;
        const instituteId = req.user._id;

        const existingTeacher = await Teacher.findOne({
            $or: [{ email }, { employeeId }]
        });

        if (existingTeacher) {
            return res.status(400).json({
                success: false,
                message: "Teacher with this email or Employee ID already exists"
            });
        }

        const teacher = new Teacher({
            instituteId,
            branchId,
            employeeId,
            firstName,
            lastName,
            email,
            password,
            phone,
            department,
            designation,
            roleId
        });

        await teacher.save();

        res.status(201).json({
            success: true,
            message: "Teacher added successfully",
            data: teacher,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET TEACHERS =================
export const getTeachers = async (req, res) => {
    try {
        const { branchId, department } = req.query;
        const instituteId = req.user._id;

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

        const token = generateToken(teacher._id);

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

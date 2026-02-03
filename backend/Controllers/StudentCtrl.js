import Student from "../Models/StudentModel.js";
import { generateToken } from "../Helpers/generateToken.js";

// ================= ADMIT STUDENT (CREATE) =================
export const admitStudent = async (req, res) => {
    try {
        const admissionData = req.body;
        const instituteId = req.user._id;

        // 1. Basic unique check
        const existingStudent = await Student.findOne({
            $or: [
                { email: admissionData.email, email: { $ne: null } },
                { admissionNo: admissionData.admissionNo }
            ]
        });

        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: "Student with this email or Admission No already exists"
            });
        }

        // 2. Create Student with all fields from 6-step wizard
        const student = new Student({
            ...admissionData,
            instituteId,
            // Ensure branchId is taken from body if present, else fallback logic
            branchId: admissionData.branchId
        });

        await student.save();

        res.status(201).json({
            success: true,
            message: "Student admitted successfully",
            data: student,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET STUDENTS =================
export const getStudents = async (req, res) => {
    try {
        const { branchId, classId, sectionId } = req.query;
        const instituteId = req.user._id;

        let query = { instituteId };
        if (branchId) query.branchId = branchId;
        if (classId) query.classId = classId;
        if (sectionId) query.sectionId = sectionId;

        const students = await Student.find(query)
            .populate("classId", "name")
            .populate("sectionId", "name")
            .sort({ firstName: 1 });

        res.status(200).json({
            success: true,
            data: students,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE STUDENT =================
export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Prevent password update via this route
        delete updateData.password;

        const student = await Student.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.status(200).json({
            success: true,
            message: "Student record updated successfully",
            data: student,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= STUDENT LOGIN =================
export const loginStudent = async (req, res) => {
    try {
        const { admissionNo, password } = req.body;

        const student = await Student.findOne({ admissionNo });
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        if (student.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: `Your status is ${student.status}`
            });
        }

        const isMatch = await student.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(student._id);

        student.lastLogin = new Date();
        await student.save();

        res.status(200).json({
            success: true,
            message: "Student login successful",
            data: {
                _id: student._id,
                firstName: student.firstName,
                lastName: student.lastName,
                admissionNo: student.admissionNo,
                role: "Student"
            },
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

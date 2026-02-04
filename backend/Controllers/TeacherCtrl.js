import Teacher from "../Models/TeacherModel.js";
import TeacherMapping from "../Models/TeacherMappingModel.js";
import { generateToken } from "../Helpers/generateToken.js";
import { generateRandomPassword } from "../Helpers/generateRandomPassword.js";
import { sendLoginCredentialsEmail } from "../Helpers/SendMail.js";
import Section from "../Models/SectionModel.js";
import Subject from "../Models/SubjectModel.js";
import Class from "../Models/ClassModel.js";
import Student from "../Models/StudentModel.js";

// ================= CREATE TEACHER =================
export const createTeacher = async (req, res) => {
    try {
        const {
            firstName, lastName, email,
             phone, branchId, department,
            designation, roleId, experience, joiningDate,
            teachingStatus, status
        } = req.body;
        let { employeeId } = req.body;
        const instituteId = req.user._id;

        // Generate Random Employee ID if not provided
        if (!employeeId) {
            employeeId = "EMP" + Math.floor(100000 + Math.random() * 900000);
        }

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

// ================= GET TEACHER ASSIGNED CLASSES & SUBJECTS =================
export const getTeacherClasses = async (req, res) => {
    try {
        const teacherId = req.user._id;

        // Fetch all mappings for this teacher
        const mappings = await TeacherMapping.find({ teacherId, status: "active" })
            .populate("classId", "name")
            .populate("sectionId", "name")
            .populate("subjectId", "name code")
            .populate("courseId", "name")
            .populate("academicYearId", "name");

        if (!mappings || mappings.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No classes or subjects assigned yet.",
                data: {
                    subjects: [],
                    totalClasses: 0,
                    totalSubjects: 0
                }
            });
        }

        // Group by Subject
        const subjectGroups = {};

        for (const m of mappings) {
            const subjectId = m.subjectId?._id?.toString() || "unknown";

            if (!subjectGroups[subjectId]) {
                subjectGroups[subjectId] = {
                    subjectId: subjectId,
                    subjectName: m.subjectId?.name || "N/A",
                    subjectCode: m.subjectId?.code || "N/A",
                    academicYear: m.academicYearId?.name || "N/A",
                    status: m.status?.toUpperCase() || "ACTIVE",
                    classesCount: 0,
                    totalStudents: 0,
                    classes: []
                };
            }

            const sectionId = m.sectionId?._id;

            // Fetch student count for this section
            const studentCount = sectionId
                ? await Student.countDocuments({ sectionId, status: "active" })
                : 0;

            subjectGroups[subjectId].classes.push({
                classId: m.classId?._id,
                sectionId: sectionId,
                className: m.classId?.name || m.courseId?.name || "N/A",
                sectionName: m.sectionId?.name || "N/A",
                fullClassName: `${m.classId?.name || m.courseId?.name || "N/A"}-${m.sectionId?.name || ""}`,
                studentCount,
                schedule: "Daily" // Day info placeholder
            });

            subjectGroups[subjectId].classesCount += 1;
            subjectGroups[subjectId].totalStudents += studentCount;
        }

        const subjectsArray = Object.values(subjectGroups);

        res.status(200).json({
            success: true,
            data: {
                subjects: subjectsArray,
                totalSubjects: subjectsArray.length,
                totalClasses: mappings.length
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

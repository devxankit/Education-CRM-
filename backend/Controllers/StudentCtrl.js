import Student from "../Models/StudentModel.js";
import Sequence from "../Models/SequenceModel.js";
import TeacherMapping from "../Models/TeacherMappingModel.js";
import { generateToken } from "../Helpers/generateToken.js";
import { uploadBase64ToCloudinary } from "../Helpers/cloudinaryHelper.js";

// ================= ADMIT STUDENT (CREATE) =================
export const admitStudent = async (req, res) => {
    try {
        const admissionData = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        // 1. Internal Unique Check (Email)
        if (admissionData.email) {
            const existingStudent = await Student.findOne({ email: admissionData.email });
            if (existingStudent) {
                return res.status(400).json({ success: false, message: "Student with this email already exists" });
            }
        }

        // 2. Generate Sequential Admission Number
        const currentYear = new Date().getFullYear().toString();
        const sequence = await Sequence.findOneAndUpdate(
            { instituteId, type: 'admission', year: currentYear },
            { $inc: { sequenceValue: 1 } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        const admissionNo = `${sequence.prefix || 'ADM'}-${currentYear}-${sequence.sequenceValue.toString().padStart(4, '0')}`;

        // 3. Handle Cloudinary Document Uploads
        if (admissionData.documents) {
            const uploadPromises = Object.keys(admissionData.documents).map(async (key) => {
                const doc = admissionData.documents[key];
                if (doc && doc.base64) {
                    try {
                        const cloudinaryUrl = await uploadBase64ToCloudinary(doc.base64, `students/documents/${instituteId}`);
                        doc.url = cloudinaryUrl;
                        delete doc.base64; // Remove base64 from object before saving to DB
                    } catch (uploadError) {
                        console.error(`Error uploading ${key} to Cloudinary:`, uploadError);
                        // Optionally set an error status or keep going
                    }
                }
            });
            await Promise.all(uploadPromises);
        }

        // 4. Create Student
        const student = new Student({
            ...admissionData,
            admissionNo,
            instituteId,
            branchId: admissionData.branchId
        });

        await student.save();

        res.status(201).json({
            success: true,
            message: "Student admitted successfully",
            data: student,
        });
    } catch (error) {
        console.error("Admission Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET STUDENTS =================
export const getStudents = async (req, res) => {
    try {
        const { branchId, classId, sectionId } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        let query = { instituteId };
        if (branchId) query.branchId = branchId;
        if (classId) query.classId = classId;
        if (sectionId) query.sectionId = sectionId;

        const students = await Student.find(query)
            .populate("classId", "name")
            .populate("sectionId", "name")
            .populate("parentId")
            .sort({ firstName: 1 });

        res.status(200).json({
            success: true,
            data: students,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET STUDENT BY ID =================
export const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const instituteId = req.user.instituteId || req.user._id;

        const student = await Student.findOne({ _id: id, instituteId })
            .populate("branchId", "name code city phone")
            .populate("classId", "name level board")
            .populate("sectionId", "name capacity")
            .populate("parentId");

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // Fetch subjects for this student's section
        let subjects = [];
        if (student.sectionId) {
            const mappings = await TeacherMapping.find({
                sectionId: student.sectionId._id
            })
                .populate("subjectId", "name code type")
                .populate("teacherId", "firstName lastName");

            subjects = mappings.map(m => ({
                _id: m.subjectId?._id,
                name: m.subjectId?.name,
                code: m.subjectId?.code,
                type: m.subjectId?.type,
                teacher: m.teacherId
                    ? `${m.teacherId.firstName || ''} ${m.teacherId.lastName || ''}`.trim()
                    : 'Not Assigned'
            }));
        }

        res.status(200).json({
            success: true,
            data: {
                ...student.toObject(),
                subjects
            },
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

        const token = generateToken(student._id, "Student");

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

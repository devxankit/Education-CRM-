import Parent from "../Models/ParentModel.js";
import Student from "../Models/StudentModel.js";
import { generateToken } from "../Helpers/generateToken.js";

// ================= CREATE PARENT =================
export const createParent = async (req, res) => {
    try {
        const { name, mobile, email, relationship, branchId, address, occupation } = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        const existingParent = await Parent.findOne({
            $or: [{ mobile }, { email: email || "no-email" }]
        });

        if (existingParent && (existingParent.mobile === mobile || (email && existingParent.email === email))) {
            return res.status(400).json({
                success: false,
                message: "Parent with this mobile or email already exists"
            });
        }

        const parentCode = `PRT-${Date.now().toString().slice(-6)}`;

        const parent = new Parent({
            instituteId,
            branchId,
            name,
            mobile,
            email,
            relationship,
            address,
            occupation,
            code: parentCode,
            password: mobile // Default password as mobile number
        });

        await parent.save();

        res.status(201).json({
            success: true,
            message: "Parent record created successfully",
            data: parent,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET PARENTS =================
export const getParents = async (req, res) => {
    try {
        const { branchId, searchQuery } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        let query = { instituteId };
        if (branchId) query.branchId = branchId;

        if (searchQuery) {
            query.$or = [
                { name: { $regex: searchQuery, $options: 'i' } },
                { mobile: { $regex: searchQuery, $options: 'i' } },
                { code: { $regex: searchQuery, $options: 'i' } }
            ];
        }

        const parents = await Parent.find(query).sort({ createdAt: -1 });

        // Link students count and data
        const parentsWithStudents = await Promise.all(parents.map(async (p) => {
            const students = await Student.find({
                $or: [
                    { parentId: p._id },
                    { parentMobile: p.mobile }
                ]
            }).select("firstName lastName classId sectionId").populate("classId sectionId", "name");

            return {
                ...p._doc,
                studentCount: students.length,
                linkedStudents: students.map(s => ({
                    id: s._id,
                    studentName: `${s.firstName} ${s.lastName}`,
                    class: `${s.classId?.name || ''}-${s.sectionId?.name || ''}`
                }))
            };
        }));

        res.status(200).json({
            success: true,
            data: parentsWithStudents,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE PARENT =================
export const updateParent = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        delete updateData.password; // Don't allow password update here

        const parent = await Parent.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!parent) {
            return res.status(404).json({ success: false, message: "Parent not found" });
        }

        res.status(200).json({
            success: true,
            message: "Parent record updated successfully",
            data: parent,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= PARENT LOGIN =================
export const loginParent = async (req, res) => {
    try {
        const { mobile, password } = req.body;

        const parent = await Parent.findOne({ mobile });
        if (!parent) {
            return res.status(404).json({ success: false, message: "Parent not found" });
        }

        if (parent.status !== 'Active') {
            return res.status(403).json({
                success: false,
                message: `Your account is ${parent.status}`
            });
        }

        const isMatch = await parent.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(parent._id, "Parent");

        parent.lastLogin = new Date();
        await parent.save();

        res.status(200).json({
            success: true,
            message: "Parent login successful",
            data: {
                _id: parent._id,
                name: parent.name,
                mobile: parent.mobile,
                role: "Parent"
            },
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET LINKED STUDENTS =================
export const getLinkedStudents = async (req, res) => {
    try {
        const { parentId } = req.params;

        const students = await Student.find({ parentId })
            .populate("classId", "name")
            .populate("sectionId", "name")
            .select("firstName lastName admissionNo classId sectionId");

        const linkedStudents = students.map(s => ({
            _id: s._id,
            studentName: `${s.firstName} ${s.lastName}`,
            admissionNo: s.admissionNo,
            class: `${s.classId?.name || 'N/A'} - ${s.sectionId?.name || 'N/A'}`
        }));

        res.status(200).json({
            success: true,
            data: linkedStudents
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= LINK STUDENT =================
export const linkStudent = async (req, res) => {
    try {
        const { parentId } = req.params;
        const { studentId } = req.body;

        const student = await Student.findByIdAndUpdate(
            studentId,
            { parentId },
            { new: true }
        ).populate("classId", "name").populate("sectionId", "name");

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.status(200).json({
            success: true,
            message: "Student linked successfully",
            data: {
                _id: student._id,
                studentName: `${student.firstName} ${student.lastName}`,
                admissionNo: student.admissionNo,
                class: `${student.classId?.name || 'N/A'} - ${student.sectionId?.name || 'N/A'}`
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UNLINK STUDENT =================
export const unlinkStudent = async (req, res) => {
    try {
        const { parentId } = req.params;
        const { studentId } = req.body;

        const student = await Student.findByIdAndUpdate(
            studentId,
            { $unset: { parentId: "" } },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.status(200).json({
            success: true,
            message: "Student unlinked successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

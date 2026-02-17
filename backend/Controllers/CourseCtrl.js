import Course from "../Models/CourseModel.js";

// ================= CREATE COURSE =================
export const createCourse = async (req, res) => {
    try {
        const { name, code, type, duration, totalSemesters, creditSystem, branchId, academicYearId } = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }

        const course = new Course({
            instituteId,
            branchId,
            academicYearId: academicYearId || null,
            name,
            code: code ? code.toUpperCase() : name.split(' ').map(w => w[0]).join('').toUpperCase() + '_' + Date.now().toString().slice(-4),
            type,
            duration,
            totalSemesters,
            creditSystem
        });

        await course.save();

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: course,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET ALL COURSES =================
export const getCourses = async (req, res) => {
    try {
        const { branchId, academicYearId, type } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        let query = { instituteId };
        if (branchId) query.branchId = branchId;
        query.status = "active";
        if (type && type !== 'all') {
            query.type = type;
        }
        // Filter by academic year: include courses for this year OR courses with no year set
        if (academicYearId && academicYearId.length === 24) {
            query.$or = [
                { academicYearId },
                { academicYearId: null },
                { academicYearId: { $exists: false } }
            ];
        }

        const courses = await Course.find(query)
            .populate("teacherId", "firstName lastName employeeId email")
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: courses,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE COURSE =================
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const instituteId = req.user.instituteId || req.user._id;

        const existing = await Course.findById(id);
        if (!existing) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        if (existing.instituteId?.toString() !== instituteId?.toString()) {
            return res.status(403).json({ success: false, message: "Access denied to this course" });
        }

        const course = await Course.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).populate("teacherId", "firstName lastName employeeId email");

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: course,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE COURSE =================
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndDelete(id);

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

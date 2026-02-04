import Course from "../Models/CourseModel.js";

// ================= CREATE COURSE =================
export const createCourse = async (req, res) => {
    try {
        const { name, code, type, duration, totalSemesters, creditSystem, branchId } = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }

        const course = new Course({
            instituteId,
            branchId,
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
        const { branchId, type } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }

        let query = { instituteId, branchId };
        if (type && type !== 'all') {
            query.type = type;
        }

        const courses = await Course.find(query).sort({ name: 1 });

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
        const course = await Course.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

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

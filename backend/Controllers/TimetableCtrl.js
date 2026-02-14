import Timetable from "../Models/TimetableModel.js";

// ================= CREATE OR UPDATE TIMETABLE =================
export const upsertTimetable = async (req, res) => {
    try {
        const {
            academicYearId,
            branchId,
            classId,
            courseId,
            sectionId,
            schedule
        } = req.body;

        const instituteId = req.user.instituteId || req.user._id;

        // Validate required fields
        if (!academicYearId) {
            return res.status(400).json({
                success: false,
                message: "Academic Year is required"
            });
        }

        if (!branchId) {
            return res.status(400).json({
                success: false,
                message: "Branch is required"
            });
        }

        // Clean schedule data - remove empty teacherId strings and ensure proper format
        const cleanedSchedule = {};
        Object.keys(schedule || {}).forEach(day => {
            cleanedSchedule[day] = (schedule[day] || []).map(period => {
                const cleanedPeriod = {
                    subjectId: period.subjectId || null,
                    startTime: period.startTime || '',
                    endTime: period.endTime || '',
                    room: period.room || '',
                    type: period.type || 'offline',
                    link: period.link || ''
                };
                
                // Only include teacherId if it's a valid non-empty value
                if (period.teacherId && period.teacherId !== '' && period.teacherId !== null) {
                    cleanedPeriod.teacherId = period.teacherId;
                }
                
                return cleanedPeriod;
            }).filter(period => period.subjectId); // Only include periods with a subject
        });

        // For school: use sectionId, for college: use courseId
        // Build query based on mode
        let query;
        let updateData = {
            instituteId,
            branchId,
            academicYearId,
            schedule: cleanedSchedule,
            status: "active"
        };

        // Build $unset to ensure fields not used are removed
        const unsetData = {};

        if (courseId) {
            // College mode - use courseId
            query = { academicYearId, courseId };
            updateData.courseId = courseId;
            if (classId) updateData.classId = classId;
            // Remove sectionId if it exists
            unsetData.sectionId = "";
        } else if (sectionId) {
            // School mode - use sectionId
            query = { academicYearId, sectionId };
            updateData.sectionId = sectionId;
            if (classId) updateData.classId = classId;
            // Remove courseId if it exists - IMPORTANT: This prevents index conflicts
            unsetData.courseId = "";
            
            // Delete ALL records with same academicYearId and null/missing courseId
            // This prevents sparse index conflicts on academicYearId_1_courseId_1
            await Timetable.deleteMany({
                academicYearId,
                $or: [
                    { courseId: null },
                    { courseId: { $exists: false } }
                ]
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Either courseId (for college) or sectionId (for school) is required"
            });
        }

        // Build final update query with $unset
        const updateQuery = { ...updateData };
        if (Object.keys(unsetData).length > 0) {
            updateQuery.$unset = unsetData;
        }

        // Use findOneAndUpdate with proper handling
        let timetable;
        try {
            timetable = await Timetable.findOneAndUpdate(
                query,
                updateQuery,
                { new: true, upsert: true, runValidators: true }
            );
        } catch (error) {
            // If duplicate key error, clean up and retry
            if (error.message && error.message.includes('E11000')) {
                // Delete all records with conflicting null values
                if (sectionId) {
                    await Timetable.deleteMany({
                        academicYearId,
                        $or: [
                            { courseId: null },
                            { courseId: { $exists: false } }
                        ],
                        sectionId: { $ne: sectionId }
                    });
                } else if (courseId) {
                    await Timetable.deleteMany({
                        academicYearId,
                        $or: [
                            { sectionId: null },
                            { sectionId: { $exists: false } }
                        ],
                        courseId: { $ne: courseId }
                    });
                }
                
                // Retry the upsert
                timetable = await Timetable.findOneAndUpdate(
                    query,
                    updateQuery,
                    { new: true, upsert: true, runValidators: true }
                );
            } else {
                throw error;
            }
        }

        res.status(200).json({
            success: true,
            message: "Timetable saved successfully",
            data: timetable,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET TIMETABLE BY CONTEXT =================
export const getTimetable = async (req, res) => {
    try {
        const { academicYearId, sectionId, courseId } = req.query;

        if (!academicYearId) {
            return res.status(400).json({
                success: false,
                message: "Academic Year is required"
            });
        }

        // For school: require sectionId, for college: require courseId
        if (!courseId && !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Either Section (for school) or Course (for college) is required"
            });
        }

        // Query based on mode
        const query = courseId 
            ? { academicYearId, courseId }
            : { academicYearId, sectionId };

        const timetable = await Timetable.findOne(query)
            .populate("schedule.Mon.subjectId schedule.Mon.teacherId")
            .populate("schedule.Tue.subjectId schedule.Tue.teacherId")
            .populate("schedule.Wed.subjectId schedule.Wed.teacherId")
            .populate("schedule.Thu.subjectId schedule.Thu.teacherId")
            .populate("schedule.Fri.subjectId schedule.Fri.teacherId")
            .populate("schedule.Sat.subjectId schedule.Sat.teacherId")
            .populate("schedule.Sun.subjectId schedule.Sun.teacherId");

        res.status(200).json({
            success: true,
            data: timetable || { schedule: { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] } },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE TIMETABLE =================
export const deleteTimetable = async (req, res) => {
    try {
        const { id } = req.params;
        await Timetable.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Timetable deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

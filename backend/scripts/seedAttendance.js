
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from '../Models/StudentModel.js';
import Attendance from '../Models/AttendanceModel.js';
import Branch from '../Models/BranchModel.js';
import AcademicYear from '../Models/AcademicYearModel.js';
import Staff from '../Models/StaffModel.js';

dotenv.config({ path: './.env' });

const seedAttendance = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected successfully.");

        const students = await Student.find({ status: 'active' });
        console.log(`Found ${students.length} active students.`);

        if (students.length === 0) {
            console.log("No students found. Exiting.");
            process.exit(0);
        }

        // Get a default teacher to mark attendance
        const teacher = await Staff.findOne({ role: 'teacher' }) || await Staff.findOne();
        if (!teacher) {
            console.log("No staff found to mark attendance. Exiting.");
            process.exit(0);
        }

        const days = 30; // Last 30 days
        const statuses = ["Present", "Present", "Present", "Present", "Absent", "Late", "Present"]; // Weighted towards Present

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            // Skip Sundays
            if (date.getDay() === 0) continue;

            console.log(`Seeding attendance for ${date.toDateString()}...`);

            // Group students by Branch, Class, Section, AcademicYear to create unique attendance records
            const groupings = {};
            for (const student of students) {
                if (!student.branchId || !student.classId || !student.sectionId || !student.academicYearId) continue;
                
                const key = `${student.branchId}_${student.classId}_${student.sectionId}_${student.academicYearId}`;
                if (!groupings[key]) {
                    groupings[key] = {
                        instituteId: student.instituteId,
                        branchId: student.branchId,
                        classId: student.classId,
                        sectionId: student.sectionId,
                        academicYearId: student.academicYearId,
                        students: []
                    };
                }
                groupings[key].students.push(student._id);
            }

            for (const key in groupings) {
                const group = groupings[key];
                
                // Check if attendance already exists for this group and date
                const existing = await Attendance.findOne({
                    classId: group.classId,
                    sectionId: group.sectionId,
                    date: date
                });

                if (existing) {
                    console.log(`  Attendance already exists for ${key} on ${date.toDateString()}. Skipping.`);
                    continue;
                }

                const attendanceData = group.students.map(studentId => ({
                    studentId,
                    status: statuses[Math.floor(Math.random() * statuses.length)],
                    remarks: ""
                }));

                await Attendance.create({
                    instituteId: group.instituteId,
                    branchId: group.branchId,
                    classId: group.classId,
                    sectionId: group.sectionId,
                    teacherId: teacher._id,
                    academicYearId: group.academicYearId,
                    date: date,
                    attendanceData,
                    status: "Submitted"
                });
            }
        }

        console.log("Seeding completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding attendance:", error);
        process.exit(1);
    }
};

seedAttendance();

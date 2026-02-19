import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Student from '../Models/StudentModel.js';
import Class from '../Models/ClassModel.js';
import Section from '../Models/SectionModel.js';
import AcademicYear from '../Models/AcademicYearModel.js';
import Branch from '../Models/BranchModel.js';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Sample student data
const studentsData = [
    { firstName: 'Rahul', lastName: 'Sharma', rollNo: '1', gender: 'Male', dob: '2008-05-15' },
    { firstName: 'Priya', lastName: 'Patel', rollNo: '2', gender: 'Female', dob: '2008-06-20' },
    { firstName: 'Amit', lastName: 'Kumar', rollNo: '3', gender: 'Male', dob: '2008-07-10' },
    { firstName: 'Sneha', lastName: 'Singh', rollNo: '4', gender: 'Female', dob: '2008-08-25' },
    { firstName: 'Vikram', lastName: 'Gupta', rollNo: '5', gender: 'Male', dob: '2008-09-12' },
    { firstName: 'Anjali', lastName: 'Verma', rollNo: '6', gender: 'Female', dob: '2008-10-05' },
    { firstName: 'Rohit', lastName: 'Yadav', rollNo: '7', gender: 'Male', dob: '2008-11-18' },
    { firstName: 'Kavita', lastName: 'Mishra', rollNo: '8', gender: 'Female', dob: '2008-12-22' },
    { firstName: 'Suresh', lastName: 'Reddy', rollNo: '9', gender: 'Male', dob: '2009-01-14' },
    { firstName: 'Meera', lastName: 'Joshi', rollNo: '10', gender: 'Female', dob: '2009-02-28' }
];

async function addStudentsTo10thA() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URL || process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
        if (!mongoUri) {
            console.error('❌ MongoDB URI not found in environment variables. Please check .env file.');
            console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('MONGO')));
            process.exit(1);
        }
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Find Class 10th - try multiple patterns
        let class10 = await Class.findOne({ name: /^10/i }).sort({ createdAt: -1 });
        if (!class10) {
            class10 = await Class.findOne({ name: /10th/i }).sort({ createdAt: -1 });
        }
        if (!class10) {
            class10 = await Class.findOne({ name: /Class 10/i }).sort({ createdAt: -1 });
        }
        if (!class10) {
            // Show available classes
            const allClasses = await Class.find({}).select('name level').sort({ name: 1 }).limit(20);
            console.error('❌ Class 10th not found. Available classes:');
            allClasses.forEach(c => console.error(`   - ${c.name} (${c.level})`));
            console.error('\nPlease create Class 10th first or update the script to use an existing class.');
            process.exit(1);
        }
        console.log(`✅ Found Class: ${class10.name} (ID: ${class10._id})`);

        // Find Section A
        const sectionA = await Section.findOne({ 
            classId: class10._id, 
            name: /^A$/i 
        });
        if (!sectionA) {
            console.error('❌ Section A not found for Class 10th. Please create it first.');
            process.exit(1);
        }
        console.log(`✅ Found Section: ${sectionA.name} (ID: ${sectionA._id})`);

        // Get institute and branch IDs
        const instituteId = class10.instituteId;
        const branchId = class10.branchId;

        // Get active academic year
        const academicYear = await AcademicYear.findOne({ 
            instituteId, 
            status: 'active' 
        }).sort({ startDate: -1 });
        
        const academicYearId = academicYear?._id || null;
        if (academicYear) {
            console.log(`✅ Found Academic Year: ${academicYear.name} (ID: ${academicYear._id})`);
        } else {
            console.log('⚠️  No active academic year found. Proceeding without it.');
        }

        // Get existing admission numbers to avoid duplicates
        const existingAdmissionNos = await Student.find({ instituteId })
            .select('admissionNo')
            .lean();
        const usedAdmissionNos = new Set(existingAdmissionNos.map(s => s.admissionNo));

        // Generate unique admission numbers
        let baseAdmissionNo = 1;
        const generateAdmissionNo = () => {
            let admissionNo;
            do {
                admissionNo = `ADM${new Date().getFullYear()}${String(baseAdmissionNo).padStart(4, '0')}`;
                baseAdmissionNo++;
            } while (usedAdmissionNos.has(admissionNo));
            usedAdmissionNos.add(admissionNo);
            return admissionNo;
        };

        // Add students
        const addedStudents = [];
        const errors = [];

        for (const studentData of studentsData) {
            try {
                const admissionNo = generateAdmissionNo();
                const email = `parent.${admissionNo.toLowerCase()}@example.com`;

                // Check if student already exists
                const existing = await Student.findOne({
                    instituteId,
                    classId: class10._id,
                    sectionId: sectionA._id,
                    rollNo: studentData.rollNo
                });

                if (existing) {
                    console.log(`⚠️  Student with Roll No ${studentData.rollNo} already exists. Skipping...`);
                    continue;
                }

                // Create student
                const student = new Student({
                    instituteId,
                    branchId,
                    admissionNo,
                    rollNo: studentData.rollNo,
                    firstName: studentData.firstName,
                    lastName: studentData.lastName,
                    parentEmail: email,
                    password: await bcrypt.hash('password123', 10), // Default password
                    dob: new Date(studentData.dob),
                    gender: studentData.gender,
                    academicYearId,
                    classId: class10._id,
                    sectionId: sectionA._id,
                    status: 'active',
                    nationality: 'Indian',
                    category: 'General'
                });

                await student.save();
                addedStudents.push({
                    name: `${studentData.firstName} ${studentData.lastName}`,
                    admissionNo,
                    rollNo: studentData.rollNo
                });
                console.log(`✅ Added: ${studentData.firstName} ${studentData.lastName} (Roll: ${studentData.rollNo}, Admission: ${admissionNo})`);
            } catch (error) {
                errors.push({
                    student: `${studentData.firstName} ${studentData.lastName}`,
                    error: error.message
                });
                console.error(`❌ Error adding ${studentData.firstName} ${studentData.lastName}:`, error.message);
            }
        }

        // Summary
        console.log('\n📊 Summary:');
        console.log(`✅ Successfully added: ${addedStudents.length} students`);
        console.log(`❌ Errors: ${errors.length}`);
        
        if (addedStudents.length > 0) {
            console.log('\n📝 Added Students:');
            addedStudents.forEach(s => {
                console.log(`   - ${s.name} (Roll: ${s.rollNo}, Admission: ${s.admissionNo})`);
            });
        }

        if (errors.length > 0) {
            console.log('\n⚠️  Errors:');
            errors.forEach(e => {
                console.log(`   - ${e.student}: ${e.error}`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

// Run the script
addStudentsTo10thA();

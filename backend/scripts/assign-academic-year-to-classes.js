/**
 * Assign Academic Year 2026-27 to existing classes that don't have one
 * Run: node backend/scripts/assign-academic-year-to-classes.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

import AcademicYear from '../Models/AcademicYearModel.js';
import Class from '../Models/ClassModel.js';

const MONGODB_URI = process.env.MONGODB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/Education-CRM';

async function assignAcademicYearToClasses() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const year2026 = await AcademicYear.findOne({
            name: { $regex: /2026[-]?27|2026[-]?2027/i }
        });

        if (!year2026) {
            console.log('Academic Year 2026-27 not found. Available years:');
            const all = await AcademicYear.find({}).select('name _id').lean();
            all.forEach(y => console.log(`  - ${y.name} (${y._id})`));
            process.exit(1);
        }

        console.log(`Found academic year: ${year2026.name} (${year2026._id})`);

        const result = await Class.updateMany(
            { $or: [{ academicYearId: null }, { academicYearId: { $exists: false } }] },
            { $set: { academicYearId: year2026._id } }
        );

        console.log(`Updated ${result.modifiedCount} class(es) with academic year "${year2026.name}".`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

assignAcademicYearToClasses();

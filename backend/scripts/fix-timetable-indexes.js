/**
 * Migration script to fix timetable duplicate key errors
 * Run this script once to clean up existing duplicate records
 * 
 * Usage: node backend/scripts/fix-timetable-indexes.js
 * Or: mongosh <database_name> fix-timetable-indexes.js
 */

import mongoose from 'mongoose';
import Timetable from '../Models/TimetableModel.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ERP-School';

async function fixTimetableIndexes() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Drop existing indexes
        console.log('Dropping existing indexes...');
        try {
            await Timetable.collection.dropIndex('academicYearId_1_courseId_1');
            console.log('Dropped index: academicYearId_1_courseId_1');
        } catch (e) {
            console.log('Index academicYearId_1_courseId_1 does not exist or already dropped');
        }

        try {
            await Timetable.collection.dropIndex('academicYearId_1_sectionId_1');
            console.log('Dropped index: academicYearId_1_sectionId_1');
        } catch (e) {
            console.log('Index academicYearId_1_sectionId_1 does not exist or already dropped');
        }

        // Clean up duplicate records with null values
        console.log('Cleaning up duplicate records...');
        
        // Find all records grouped by academicYearId
        const timetables = await Timetable.find({});
        const groupedByYear = {};
        
        timetables.forEach(t => {
            const yearId = t.academicYearId.toString();
            if (!groupedByYear[yearId]) {
                groupedByYear[yearId] = [];
            }
            groupedByYear[yearId].push(t);
        });

        // For each academicYearId, keep only one record with null courseId/sectionId
        let deletedCount = 0;
        for (const [yearId, records] of Object.entries(groupedByYear)) {
            const nullCourseRecords = records.filter(r => !r.courseId || r.courseId === null);
            const nullSectionRecords = records.filter(r => !r.sectionId || r.sectionId === null);
            
            // If multiple records with null courseId, keep the first one, delete others
            if (nullCourseRecords.length > 1) {
                const toDelete = nullCourseRecords.slice(1);
                const idsToDelete = toDelete.map(r => r._id);
                await Timetable.deleteMany({ _id: { $in: idsToDelete } });
                deletedCount += idsToDelete.length;
                console.log(`Deleted ${idsToDelete.length} duplicate records for academicYearId: ${yearId} (null courseId)`);
            }
            
            // If multiple records with null sectionId, keep the first one, delete others
            if (nullSectionRecords.length > 1) {
                const toDelete = nullSectionRecords.slice(1);
                const idsToDelete = toDelete.map(r => r._id);
                await Timetable.deleteMany({ _id: { $in: idsToDelete } });
                deletedCount += idsToDelete.length;
                console.log(`Deleted ${idsToDelete.length} duplicate records for academicYearId: ${yearId} (null sectionId)`);
            }
        }

        console.log(`Total records deleted: ${deletedCount}`);

        // Recreate indexes with sparse option
        console.log('Recreating indexes...');
        await Timetable.collection.createIndex(
            { academicYearId: 1, sectionId: 1 },
            { unique: true, sparse: true, name: 'academicYearId_1_sectionId_1' }
        );
        console.log('Created index: academicYearId_1_sectionId_1');

        await Timetable.collection.createIndex(
            { academicYearId: 1, courseId: 1 },
            { unique: true, sparse: true, name: 'academicYearId_1_courseId_1' }
        );
        console.log('Created index: academicYearId_1_courseId_1');

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

fixTimetableIndexes();

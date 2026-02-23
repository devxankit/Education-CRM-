/**
 * Drop old (instituteId, academicYearId) unique index from ExamPolicy so branch-wise policies work.
 * Run from project root: node backend/scripts/fix-exam-policy-index.js
 * Or from backend folder: node scripts/fix-exam-policy-index.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

import ExamPolicy from '../Models/ExamPolicyModel.js';

const MONGODB_URI = process.env.MONGODB_URL || process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/ERP-School';

async function fixExamPolicyIndex() {
    try {
        console.log('Connecting to MongoDB...', MONGODB_URI.replace(/\/\/[^@]+@/, '//***@'));
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const collection = mongoose.connection.collection('exampolicies');
        const indexes = await collection.indexes();
        console.log('Existing indexes:', indexes.map((i) => i.name));

        try {
            await collection.dropIndex('instituteId_1_academicYearId_1');
            console.log('Dropped old index: instituteId_1_academicYearId_1');
        } catch (e) {
            if (e.code === 27 || e.codeName === 'IndexNotFound') {
                console.log('Index instituteId_1_academicYearId_1 does not exist or already dropped.');
            } else if (e.code === 26 || e.codeName === 'NamespaceNotFound') {
                console.log('Collection does not exist yet.');
            } else {
                throw e;
            }
        }

        await ExamPolicy.syncIndexes();
        console.log('Compound index (instituteId, academicYearId, branchId) ensured.');

        console.log('Done.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixExamPolicyIndex();

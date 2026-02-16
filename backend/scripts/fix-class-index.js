/**
 * Migrate Class unique index: (branchId, name) -> (branchId, academicYearId, name)
 * Run: node backend/scripts/fix-class-index.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/Education-CRM';

async function fixClassIndex() {
    try {
        await mongoose.connect(MONGODB_URI);
        const conn = mongoose.connection;
        const collection = conn.collection('classes');

        try {
            await collection.dropIndex('branchId_1_name_1');
            console.log('Dropped old index: branchId_1_name_1');
        } catch (e) {
            if (e.codeName === 'IndexNotFound') console.log('Old index already removed.');
            else console.warn('Drop index:', e.message);
        }

        await collection.createIndex(
            { branchId: 1, academicYearId: 1, name: 1 },
            { unique: true, sparse: true }
        );
        console.log('Created new index: branchId_1_academicYearId_1_name_1');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixClassIndex();

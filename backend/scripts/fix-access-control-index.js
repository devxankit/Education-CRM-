/**
 * Drop old instituteId unique index from AccessControl (blocking branch-wise policies)
 * Run: node backend/scripts/fix-access-control-index.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import AccessControl from '../Models/AccessControlModel.js';

const MONGODB_URI = process.env.MONGODB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/ERP-School';

async function fixAccessControlIndex() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const collection = AccessControl.collection;

        // Drop old instituteId unique index
        try {
            await collection.dropIndex('instituteId_1');
            console.log('Dropped old index: instituteId_1');
        } catch (e) {
            if (e.code === 27 || e.codeName === 'IndexNotFound') {
                console.log('Index instituteId_1 does not exist or already dropped.');
            } else {
                throw e;
            }
        }

        // Ensure compound index exists
        await AccessControl.createIndexes();
        console.log('Compound index (instituteId, branchId) ensured.');

        console.log('Done.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixAccessControlIndex();

/**
 * Assign existing academic years (without branch) to SVM 1 Indore
 * Run: node backend/scripts/assign-academic-years-to-branch.js
 * Or from project root: node backend/scripts/assign-academic-years-to-branch.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

import AcademicYear from '../Models/AcademicYearModel.js';
import Branch from '../Models/BranchModel.js';

const MONGODB_URI = process.env.MONGODB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/Education-CRM';

async function assignAcademicYearsToBranch() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const allBranches = await Branch.find({}).select('name _id').lean();
        console.log('Available branches:', allBranches.length);
        allBranches.forEach(b => console.log(`  - ${b.name} (${b._id})`));

        let branch = allBranches.find(b =>
            (b.name || '').toLowerCase().includes('svm') && (b.name || '').toLowerCase().includes('indore')
        );
        if (!branch) branch = allBranches[0];

        if (!branch) {
            console.log('No branches found. Create a branch first.');
            process.exit(1);
        }

        console.log(`Found branch: ${branch.name} (${branch._id})`);

        const result = await AcademicYear.updateMany(
            { $or: [{ branchId: null }, { branchId: { $exists: false } }] },
            { $set: { branchId: branch._id } }
        );

        console.log(`Updated ${result.modifiedCount} academic year(s) to branch "${branch.name}".`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

assignAcademicYearsToBranch();

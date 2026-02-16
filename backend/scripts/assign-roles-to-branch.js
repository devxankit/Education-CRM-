/**
 * Assign all existing roles to SVM Indore V1 branch
 * Run: node backend/scripts/assign-roles-to-branch.js
 * Or from project root: node backend/scripts/assign-roles-to-branch.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import Role from '../Models/RoleModel.js';
import Branch from '../Models/BranchModel.js';

const MONGODB_URI = process.env.MONGODB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/Education-CRM';

async function assignRolesToBranch() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        // Find branch - match "SVM Indore V1" or "SVM 1 Indore" etc.
        const branch = await Branch.findOne({
            name: { $regex: /svm\s*.*indore|indore\s*.*svm/i }
        });

        if (!branch) {
            console.log('Branch not found. Available branches:');
            const all = await Branch.find({}).select('name _id');
            all.forEach(b => console.log(`  - ${b.name} (${b._id})`));
            process.exit(1);
        }

        console.log(`Found branch: ${branch.name} (${branch._id})`);

        const result = await Role.updateMany(
            {},
            { $set: { branchId: branch._id } }
        );

        console.log(`Updated ${result.modifiedCount} roles to branch "${branch.name}".`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

assignRolesToBranch();

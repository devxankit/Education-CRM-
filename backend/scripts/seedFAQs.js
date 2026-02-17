import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import FAQ from "../Models/FAQModel.js";
import Institute from "../Models/InstituteModel.js";
import { dbConnect } from "../Config/dbConnect.js";

const defaultFAQs = [
    {
        question: "How to reset my password?",
        answer: "You can reset your password by going to Profile > Settings > Change Password. If you forgot your password, contact Admin or use the 'Forgot Password' link on the login page.",
        category: "Account",
        order: 1,
    },
    {
        question: "How to pay fees online?",
        answer: "Go to the Fees page and click on the Pay Now button. You can use debit/credit cards, UPI, or net banking. Payment confirmation will be sent via email and SMS.",
        category: "Fees",
        order: 2,
    },
    {
        question: "How to apply for leave?",
        answer: "Navigate to Profile, then select 'Apply for Leave'. Fill in the dates and reason, then submit for approval. Your class teacher or admin will review and approve the request.",
        category: "Attendance",
        order: 3,
    },
    {
        question: "How to update my contact details?",
        answer: "Go to Profile > Edit Profile. You can update your mobile number and email. For critical changes like name or address, please contact the admin office.",
        category: "Profile",
        order: 4,
    },
    {
        question: "Where can I find syllabus and notes?",
        answer: "Check the Notes or Syllabus section under Academics. Teachers upload materials by subject and class. If you cannot find something, contact your class teacher.",
        category: "Academics",
        order: 5,
    },
];

async function seedFAQs() {
    try {
        await dbConnect();

        const institute = await Institute.findOne().select("_id").lean();
        if (!institute) {
            console.error("❌ No institute found. Please create an institute first.");
            process.exit(1);
        }

        const instituteId = institute._id;

        const faqsToInsert = defaultFAQs.map((f) => ({
            instituteId,
            ...f,
            status: "active",
        }));

        await FAQ.insertMany(faqsToInsert);
        console.log("✅ 5 FAQs added successfully!");
    } catch (err) {
        console.error("❌ Seed error:", err.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

seedFAQs();

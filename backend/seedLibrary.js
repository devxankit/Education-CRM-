import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './Models/BookModel.js';
import LibraryMember from './Models/LibraryMemberModel.js';
import BookIssue from './Models/BookIssueModel.js';
import Student from './Models/StudentModel.js';
import Branch from './Models/BranchModel.js';
import Institute from './Models/InstituteModel.js';
import LibraryFine from './Models/LibraryFineModel.js';

dotenv.config();

const seedLibrary = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB...");

        // 1. Get First Institute and Branch
        const institute = await Institute.findOne();
        const branch = await Branch.findOne({ instituteId: institute?._id });

        if (!institute || !branch) {
            console.error("No Institute or Branch found. Please create one first.");
            process.exit(1);
        }

        console.log(`Seeding for Institute: ${institute._id}, Branch: ${branch.name}`);

        // 2. Create Dummy Books
        const booksData = [
            { title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780743273565", category: "Fiction", quantity: 5, availableQuantity: 5, rackNumber: "A-101", publisher: "Scribner", instituteId: institute._id, branchId: branch._id },
            { title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "9780061120084", category: "Classics", quantity: 3, availableQuantity: 3, rackNumber: "B-202", publisher: "J.B. Lippincott & Co.", instituteId: institute._id, branchId: branch._id },
            { title: "1984", author: "George Orwell", isbn: "9780451524935", category: "Dystopian", quantity: 10, availableQuantity: 10, rackNumber: "C-303", publisher: "Secker & Warburg", instituteId: institute._id, branchId: branch._id },
            { title: "Mathematics Vol 1", author: "R.D. Sharma", isbn: "MATH101", category: "Academic", quantity: 15, availableQuantity: 15, rackNumber: "S-01", publisher: "Dhanpat Rai", instituteId: institute._id, branchId: branch._id },
            { title: "Atomic Habits", author: "James Clear", isbn: "9780735211292", category: "Self Help", quantity: 8, availableQuantity: 8, rackNumber: "SH-01", publisher: "Penguin", instituteId: institute._id, branchId: branch._id }
        ];

        await Book.deleteMany({ instituteId: institute._id });
        const createdBooks = await Book.insertMany(booksData);
        console.log(`${createdBooks.length} Books created.`);

        // 3. Create Library Members for existing students
        const students = await Student.find({ branchId: branch._id }).limit(5);
        if (students.length === 0) {
            console.log("No students found to create library members.");
        } else {
            await LibraryMember.deleteMany({ instituteId: institute._id });
            const membersData = students.map((s, i) => ({
                instituteId: institute._id,
                branchId: branch._id,
                memberType: 'student',
                studentId: s._id,
                libraryCardNo: `LIB-${1000 + i}`,
                maxBooksAllowed: 3,
                status: 'active'
            }));
            const createdMembers = await LibraryMember.insertMany(membersData);
            console.log(`${createdMembers.length} Members created.`);

            // 4. Create some issues
            await BookIssue.deleteMany({ instituteId: institute._id });
            const issuesData = [
                {
                    instituteId: institute._id,
                    branchId: branch._id,
                    bookId: createdBooks[0]._id,
                    memberId: createdMembers[0]._id,
                    issueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                    status: 'issued'
                },
                {
                    instituteId: institute._id,
                    branchId: branch._id,
                    bookId: createdBooks[3]._id,
                    memberId: createdMembers[1]._id,
                    issueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // Overdue
                    dueDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
                    status: 'issued'
                }
            ];

            const createdIssues = await BookIssue.insertMany(issuesData);
            console.log(`${createdIssues.length} Issues created.`);

            // 5. Create Dummy Fines
            await LibraryFine.deleteMany({ instituteId: institute._id });
            const finesData = [
                {
                    instituteId: institute._id,
                    branchId: branch._id,
                    memberId: createdMembers[1]._id,
                    issueId: createdIssues[1]._id,
                    amount: 50,
                    reason: "Late return - 8 days delay",
                    status: "unpaid"
                },
                {
                    instituteId: institute._id,
                    branchId: branch._id,
                    memberId: createdMembers[2]._id,
                    amount: 200,
                    reason: "Book damage penalty",
                    status: "unpaid"
                },
                {
                    instituteId: institute._id,
                    branchId: branch._id,
                    memberId: createdMembers[0]._id,
                    amount: 100,
                    reason: "Previous overdue fine",
                    status: "paid",
                    paymentDate: new Date(),
                    transactionId: "TXN-LIB-5566"
                }
            ];
            const createdFines = await LibraryFine.insertMany(finesData);
            console.log(`${createdFines.length} Fines created.`);
        }

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedLibrary();

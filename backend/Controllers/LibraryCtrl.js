import Book from "../Models/BookModel.js";
import LibraryMember from "../Models/LibraryMemberModel.js";
import BookIssue from "../Models/BookIssueModel.js";
import LibraryReservation from "../Models/LibraryReservationModel.js";
import LibraryFine from "../Models/LibraryFineModel.js";
import Student from "../Models/StudentModel.js";
import Teacher from "../Models/TeacherModel.js";
import Staff from "../Models/StaffModel.js";

// ================= BOOKS CATALOG =================

export const getBooks = async (req, res) => {
    try {
        const { branchId, search, category } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        const query = { instituteId };
        if (branchId) query.branchId = branchId;
        if (category) query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { isbn: { $regex: search, $options: 'i' } }
            ];
        }

        const books = await Book.find(query).sort({ title: 1 });
        res.status(200).json({ success: true, data: books });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addBook = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const bookData = { ...req.body, instituteId };
        
        // Initial available quantity equals total quantity
        bookData.availableQuantity = req.body.quantity || 1;

        const book = new Book(bookData);
        await book.save();
        res.status(201).json({ success: true, message: "Book added successfully", data: book });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= MEMBERS MANAGEMENT =================

export const getLibraryMembers = async (req, res) => {
    try {
        const { branchId, search } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        const query = { instituteId };
        if (branchId) query.branchId = branchId;

        const members = await LibraryMember.find(query)
            .populate("studentId", "firstName lastName admissionNo studentEmail")
            .populate("teacherId", "firstName lastName employeeId")
            .populate("staffId", "name email");
        
        res.status(200).json({ success: true, data: members });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addLibraryMember = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        let { studentId, teacherId, memberType, libraryCardNo, branchId } = req.body;

        // Check if libraryCardNo already exists in this institute
        const existingCard = await LibraryMember.findOne({ instituteId, libraryCardNo });
        if (existingCard) {
            return res.status(400).json({ success: false, message: "Library Card Number already in use" });
        }

        const isObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

        if (memberType === 'student' && studentId && !isObjectId(studentId)) {
            // Try to find student by admissionNo
            const student = await Student.findOne({ instituteId, branchId, admissionNo: studentId });
            if (!student) return res.status(404).json({ success: false, message: `Student with Admission No: ${studentId} not found` });
            studentId = student._id;
        }

        if (memberType === 'teacher' && teacherId && !isObjectId(teacherId)) {
            // Try to find teacher by employeeId
            const teacher = await Teacher.findOne({ instituteId, branchId, employeeId: teacherId });
            if (!teacher) return res.status(404).json({ success: false, message: `Teacher with Employee ID: ${teacherId} not found` });
            teacherId = teacher._id;
        }

        const memberData = { 
            ...req.body, 
            instituteId, 
            studentId: studentId || undefined, 
            teacherId: teacherId || undefined 
        };

        const member = new LibraryMember(memberData);
        await member.save();
        res.status(210).json({ success: true, message: "Member registered successfully", data: member });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= BOOK ISSUANCE =================

export const issueBook = async (req, res) => {
    try {
        const { bookId, memberId, dueDate } = req.body;
        const instituteId = req.user.instituteId || req.user._id;
        const branchId = req.body.branchId;

        // 1. Check if book available
        const book = await Book.findById(bookId);
        if (!book || book.availableQuantity <= 0) {
            return res.status(400).json({ success: false, message: "Book not available for issuance" });
        }

        // 2. Check if member active and hasn't reached limit
        const member = await LibraryMember.findById(memberId);
        if (!member || member.status !== 'active') {
            return res.status(400).json({ success: false, message: "Member not found or inactive" });
        }

        const currentlyIssued = await BookIssue.countDocuments({ memberId, status: 'issued' });
        if (currentlyIssued >= (member.maxBooksAllowed || 2)) {
            return res.status(400).json({ success: false, message: "Member has reached the book issuance limit" });
        }

        // 3. Create Issue Record
        const issue = new BookIssue({
            instituteId,
            branchId,
            bookId,
            memberId,
            dueDate,
            issuedBy: req.user._id
        });

        // 4. Update Book availability
        book.availableQuantity -= 1;
        if (book.availableQuantity === 0) book.status = 'out_of_stock';
        
        await issue.save();
        await book.save();

        res.status(201).json({ success: true, message: "Book issued successfully", data: issue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const returnBook = async (req, res) => {
    try {
        const { issueId, returnDate, fineAmount, remarks } = req.body;

        const issue = await BookIssue.findById(issueId);
        if (!issue || issue.status === 'returned') {
            return res.status(400).json({ success: false, message: "Invalid issue record" });
        }

        // 1. Update Issue Record
        issue.returnDate = returnDate || new Date();
        issue.status = 'returned';
        issue.fineAmount = fineAmount || 0;
        issue.remarks = remarks;
        await issue.save();

        // 2. Update Book Quantity
        const book = await Book.findById(issue.bookId);
        if (book) {
            book.availableQuantity += 1;
            book.status = 'available';
            await book.save();
        }

        // 3. Create Fine Record if applicable
        if (fineAmount > 0) {
            const fine = new LibraryFine({
                instituteId: issue.instituteId,
                branchId: issue.branchId,
                issueId: issue._id,
                memberId: issue.memberId,
                amount: fineAmount,
                reason: "Late Return Fine",
                status: "unpaid"
            });
            await fine.save();
        }

        res.status(200).json({ success: true, message: "Book returned successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= RESERVATIONS =================

export const getReservations = async (req, res) => {
    try {
        const { branchId } = req.query;
        const instituteId = req.user.instituteId || req.user._id;
        const query = { instituteId };
        if (branchId) query.branchId = branchId;

        const reservations = await LibraryReservation.find(query)
            .populate("bookId", "title author")
            .populate("memberId", "libraryCardNo");
        
        res.status(200).json({ success: true, data: reservations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= FINES & PENALTIES =================

export const getLibraryFines = async (req, res) => {
    try {
        const { branchId, status } = req.query;
        const instituteId = req.user.instituteId || req.user._id;
        const query = { instituteId };
        if (branchId) query.branchId = branchId;
        if (status) query.status = status;

        const fines = await LibraryFine.find(query)
            .populate({
                path: "memberId",
                populate: [
                    { path: "studentId", select: "firstName lastName" },
                    { path: "teacherId", select: "firstName lastName" }
                ]
            })
            .populate("issueId", "bookId issueDate returnDate");

        res.status(200).json({ success: true, data: fines });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

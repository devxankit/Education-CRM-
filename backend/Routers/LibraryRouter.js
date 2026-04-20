import express from "express";
import { AuthMiddleware } from "../Middlewares/authMiddleware.js";
import { 
    getBooks, addBook, 
    getLibraryMembers, addLibraryMember,
    issueBook, returnBook,
    getReservations,
    getLibraryFines
} from "../Controllers/LibraryCtrl.js";

const router = express.Router();

// All library routes require authentication
router.use(AuthMiddleware);

// Books Catalog
router.get("/books", getBooks);
router.post("/books/add", addBook);

// Members
router.get("/members", getLibraryMembers);
router.post("/members/add", addLibraryMember);

// Issuance & Returns
router.post("/issue", issueBook);
router.post("/return", returnBook);

// Reservations
router.get("/reservations", getReservations);

// Fines
router.get("/fines", getLibraryFines);

export default router;

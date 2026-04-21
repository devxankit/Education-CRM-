import express from "express";
import { AuthMiddleware } from "../Middlewares/authMiddleware.js";
import { 
    getBooks, addBook, updateBook, deleteBook,
    getLibraryMembers, addLibraryMember,
    issueBook, returnBook, getIssuedBooks,
    getReservations,
    getLibraryFines, collectFine,
    getLibraryDashboardStats,
    getLibrarySettings, updateLibrarySettings
} from "../Controllers/LibraryCtrl.js";

const router = express.Router();

// All library routes require authentication
router.use(AuthMiddleware);

// Dashboard
router.get("/dashboard/stats", getLibraryDashboardStats);

// Books Catalog
router.get("/books", getBooks);
router.post("/books/add", addBook);
router.put("/books/:id", updateBook);
router.delete("/books/:id", deleteBook);

// Members
router.get("/members", getLibraryMembers);
router.post("/members/add", addLibraryMember);

// Issuance & Returns
router.get("/issued-books", getIssuedBooks);
router.post("/issue", issueBook);
router.post("/return", returnBook);

// Reservations
router.get("/reservations", getReservations);

// Fines
router.get("/fines", getLibraryFines);
router.post("/fines/collect", collectFine);

// Settings
router.get("/settings", getLibrarySettings);
router.post("/settings/update", updateLibrarySettings);

export default router;

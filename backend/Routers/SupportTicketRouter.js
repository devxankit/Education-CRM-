import { Router } from "express";
import {
    getAllTickets,
    getTicketById,
    updateTicketStatus,
    respondToTicket,
    deleteTicket,
    createTicket
} from "../Controllers/SupportTicketCtrl.js";
import { AuthMiddleware } from "../Middlewares/AuthMiddleware.js";

const router = Router();

router.use(AuthMiddleware); // All support routes are protected

router.post("/", createTicket);
router.get("/", getAllTickets);
router.get("/:id", getTicketById);
router.put("/:id/status", updateTicketStatus);
router.put("/:id/respond", respondToTicket);
router.delete("/:id", deleteTicket);

export default router;

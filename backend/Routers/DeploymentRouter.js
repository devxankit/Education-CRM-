import { Router } from 'express';
import { setupRemoteVPS } from '../Controllers/DeploymentController.js';

const router = Router();

// In a real app, you'd add protect/admin middleware here
// import { protect, admin } from '../Middlewares/authMiddleware.js';
// router.post('/setup-vps', protect, admin, setupRemoteVPS);

router.post('/setup-vps', setupRemoteVPS);

export default router;

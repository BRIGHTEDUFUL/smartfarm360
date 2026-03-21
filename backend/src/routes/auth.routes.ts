import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

// Public routes
router.post('/register', AuthController.registerValidation, AuthController.register);
router.post('/login', AuthController.loginValidation, AuthController.login);
router.post('/refresh', AuthController.refreshValidation, AuthController.refresh);
router.post('/logout', AuthController.logoutValidation, AuthController.logout);

export default router;

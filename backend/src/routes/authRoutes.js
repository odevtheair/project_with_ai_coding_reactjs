import express from 'express';
import { login, register, getProfile } from '../controllers/authController.js';
import { loginValidation, registerValidation, validate } from '../middleware/validation.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', loginValidation, validate, login);
router.post('/register', registerValidation, validate, register);

// Protected routes
router.get('/profile', verifyToken, getProfile);

export default router;

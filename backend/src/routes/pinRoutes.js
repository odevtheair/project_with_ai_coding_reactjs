import express from 'express';
import { verifyPin, mockPinApi } from '../controllers/pinController.js';
import { pinValidation, validate } from '../middleware/validation.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Protected route - requires JWT token
router.post('/verify', verifyToken, pinValidation, validate, verifyPin);

// Mock external PIN API endpoint (for testing)
router.post('/verify-pin', mockPinApi);

export default router;

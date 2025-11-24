import axios from 'axios';
import { logPinVerification } from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const EXTERNAL_PIN_API_URL = process.env.EXTERNAL_PIN_API_URL || 'http://localhost:3001/api/verify-pin';
const EXTERNAL_PIN_API_TIMEOUT = parseInt(process.env.EXTERNAL_PIN_API_TIMEOUT) || 5000;

// Verify PIN with external API
export const verifyPin = async (req, res) => {
  try {
    const { pin } = req.body;
    const userId = req.user.id;
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Call external API to verify PIN
    try {
      const response = await axios.post(
        EXTERNAL_PIN_API_URL,
        { pin },
        {
          timeout: EXTERNAL_PIN_API_TIMEOUT,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.success) {
        // Log successful verification
        await logPinVerification(userId, ipAddress, 'success');

        return res.json({
          success: true,
          message: 'PIN verified successfully'
        });
      } else {
        // Log failed verification
        await logPinVerification(userId, ipAddress, 'failed', 'Invalid PIN');

        return res.status(401).json({
          success: false,
          message: 'Invalid PIN'
        });
      }
    } catch (apiError) {
      // Handle external API errors
      let failureReason = 'External API error';

      if (apiError.code === 'ECONNABORTED') {
        failureReason = 'API timeout';
      } else if (apiError.code === 'ECONNREFUSED') {
        failureReason = 'API connection refused';
      } else if (apiError.response) {
        failureReason = `API error: ${apiError.response.status}`;
      }

      // Log failed verification
      await logPinVerification(userId, ipAddress, 'failed', failureReason);

      console.error('External PIN API error:', apiError.message);

      return res.status(503).json({
        success: false,
        message: 'PIN verification service temporarily unavailable',
        error: process.env.NODE_ENV === 'development' ? apiError.message : undefined
      });
    }
  } catch (error) {
    console.error('PIN verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Mock external PIN API (for testing purposes)
// This simulates the external API that validates PIN = 123456
export const mockPinApi = (req, res) => {
  try {
    const { pin } = req.body;

    // Simulate API processing delay
    setTimeout(() => {
      if (pin === '123456') {
        return res.json({
          success: true,
          message: 'PIN is valid'
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'PIN is invalid'
        });
      }
    }, 500); // 500ms delay to simulate network latency
  } catch (error) {
    console.error('Mock PIN API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { logLogin } from '../utils/logger.js';

// Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Get client info
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Find user
    const user = await User.findByUsername(username);

    if (!user) {
      // Log failed attempt (use temporary user ID 0 for non-existent users)
      await logLogin(0, ipAddress, userAgent, 'failed', 'User not found');

      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password);

    if (!isValidPassword) {
      // Log failed attempt
      await logLogin(user.id, ipAddress, userAgent, 'failed', 'Invalid password');

      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.username);

    // Log successful login
    await logLogin(user.id, ipAddress, userAgent, 'success');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.full_name
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Register
export const register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Check if username already exists
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Check if email already exists
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create user
    const userId = await User.create({
      username,
      email,
      password,
      fullName
    });

    // Generate JWT token
    const token = generateToken(userId, username);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: userId,
          username,
          email,
          fullName
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

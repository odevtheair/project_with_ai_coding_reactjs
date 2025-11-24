import pool from '../config/database.js';

// Log login attempts
export const logLogin = async (userId, ipAddress, userAgent, status, failureReason = null) => {
  try {
    const query = `
      INSERT INTO login_logs (user_id, ip_address, user_agent, status, failure_reason)
      VALUES (?, ?, ?, ?, ?)
    `;
    await pool.execute(query, [userId, ipAddress, userAgent, status, failureReason]);
  } catch (error) {
    console.error('Error logging login:', error);
  }
};

// Log PIN verification attempts
export const logPinVerification = async (userId, ipAddress, status, failureReason = null) => {
  try {
    const query = `
      INSERT INTO pin_verification_logs (user_id, ip_address, status, failure_reason)
      VALUES (?, ?, ?, ?)
    `;
    await pool.execute(query, [userId, ipAddress, status, failureReason]);
  } catch (error) {
    console.error('Error logging PIN verification:', error);
  }
};

// Get user's login history
export const getUserLoginHistory = async (userId, limit = 10) => {
  try {
    const query = `
      SELECT ip_address, user_agent, login_time, status, failure_reason
      FROM login_logs
      WHERE user_id = ?
      ORDER BY login_time DESC
      LIMIT ?
    `;
    const [rows] = await pool.execute(query, [userId, limit]);
    return rows;
  } catch (error) {
    console.error('Error fetching login history:', error);
    return [];
  }
};

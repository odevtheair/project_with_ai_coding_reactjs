import pool from '../config/database.js';
import bcrypt from 'bcrypt';

class User {
  // Find user by username
  static async findByUsername(username) {
    try {
      const query = 'SELECT * FROM users WHERE username = ? AND is_active = TRUE';
      const [rows] = await pool.execute(query, [username]);
      return rows[0] || null;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = ? AND is_active = TRUE';
      const [rows] = await pool.execute(query, [email]);
      return rows[0] || null;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const query = 'SELECT id, username, email, full_name, created_at FROM users WHERE id = ? AND is_active = TRUE';
      const [rows] = await pool.execute(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  // Create new user
  static async create({ username, email, password, fullName }) {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = `
        INSERT INTO users (username, email, password, full_name)
        VALUES (?, ?, ?, ?)
      `;

      const [result] = await pool.execute(query, [username, email, hashedPassword, fullName]);
      return result.insertId;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Username or email already exists');
      }
      throw new Error('Database error: ' + error.message);
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user
  static async update(id, updates) {
    try {
      const allowedFields = ['email', 'full_name'];
      const fields = [];
      const values = [];

      Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key)) {
          fields.push(`${key} = ?`);
          values.push(updates[key]);
        }
      });

      if (fields.length === 0) {
        throw new Error('No valid fields to update');
      }

      values.push(id);
      const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

      await pool.execute(query, values);
      return true;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }
}

export default User;

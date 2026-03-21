import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService } from '../services/auth.service';
import { query } from '../config/database';

interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  status: string;
  profile_photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export class AuthController {
  /**
   * Validation rules for user registration
   */
  static registerValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('first_name').trim().notEmpty().withMessage('First name is required'),
    body('last_name').trim().notEmpty().withMessage('Last name is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('role').isIn(['Farmer', 'Consumer']).withMessage('Role must be either Farmer or Consumer'),
  ];

  /**
   * Validation rules for user login
   */
  static loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ];

  /**
   * Validation rules for token refresh
   */
  static refreshValidation = [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  ];

  /**
   * Validation rules for logout
   */
  static logoutValidation = [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  ];

  /**
   * Register a new user
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Input validation failed',
            details: errors.array(),
          },
        });
        return;
      }

      const { email, password, first_name, last_name, phone, role } = req.body;

      // Check if email already exists
      const existingUser = await query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUser.rows.length > 0) {
        res.status(400).json({
          success: false,
          error: {
            code: 'DUPLICATE_EMAIL',
            message: 'Email already registered',
          },
        });
        return;
      }

      // Hash password
      const password_hash = await AuthService.hashPassword(password);

      // Create user
      await query(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [email, password_hash, first_name, last_name, phone, role, 'Active']
      );

      // Get the created user
      const userResult = await query(
        'SELECT id, email, first_name, last_name, phone, role, status, profile_photo_url, created_at FROM users WHERE email = ?',
        [email]
      );

      const user = userResult.rows[0] as User;

      // Generate tokens
      const accessToken = AuthService.generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = AuthService.generateRefreshToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Store refresh token in database
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

      await query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [user.id, refreshToken, expiresAt.toISOString()]
      );

      // Return success response
      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            role: user.role,
            status: user.status,
            profile_photo_url: user.profile_photo_url,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred during registration',
        },
      });
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Input validation failed',
            details: errors.array(),
          },
        });
        return;
      }

      const { email, password } = req.body;

      // Find user by email
      const userResult = await query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (userResult.rows.length === 0) {
        res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        });
        return;
      }

      const user = userResult.rows[0] as User;

      // Check if user is active
      if (user.status !== 'Active') {
        res.status(403).json({
          success: false,
          error: {
            code: 'ACCOUNT_INACTIVE',
            message: 'Account is inactive',
          },
        });
        return;
      }

      // Verify password
      const isPasswordValid = await AuthService.comparePassword(password, user.password_hash);

      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        });
        return;
      }

      // Generate tokens
      const accessToken = AuthService.generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = AuthService.generateRefreshToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Store refresh token in database
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

      await query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [user.id, refreshToken, expiresAt.toISOString()]
      );

      // Return success response
      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            role: user.role,
            status: user.status,
            profile_photo_url: user.profile_photo_url,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred during login',
        },
      });
    }
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  static async refresh(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Input validation failed',
            details: errors.array(),
          },
        });
        return;
      }

      const { refreshToken } = req.body;

      // Verify token
      let decoded;
      try {
        decoded = AuthService.verifyToken(refreshToken, true);
      } catch (error) {
        res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_INVALID',
            message: error instanceof Error ? error.message : 'Invalid refresh token',
          },
        });
        return;
      }

      // Check if token exists in database and is not expired
      const tokenResult = await query(
        'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > ?',
        [refreshToken, new Date().toISOString()]
      );

      if (tokenResult.rows.length === 0) {
        res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_INVALID',
            message: 'Refresh token not found or expired',
          },
        });
        return;
      }

      // Get user details
      const userResult = await query(
        'SELECT id, email, role FROM users WHERE id = ? AND status = ?',
        [decoded.userId, 'Active']
      );

      if (userResult.rows.length === 0) {
        res.status(401).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found or inactive',
          },
        });
        return;
      }

      const user = userResult.rows[0] as User;

      // Generate new access token
      const accessToken = AuthService.generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Return new access token
      res.status(200).json({
        success: true,
        data: {
          accessToken,
        },
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred during token refresh',
        },
      });
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Input validation failed',
            details: errors.array(),
          },
        });
        return;
      }

      const { refreshToken } = req.body;

      // Delete refresh token from database
      await query(
        'DELETE FROM refresh_tokens WHERE token = ?',
        [refreshToken]
      );

      // Return success response
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred during logout',
        },
      });
    }
  }
}

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

interface User {
  id: number;
  email: string;
  role: string;
}

interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

export class AuthService {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hash a password using bcrypt with 10 salt rounds
   * @param password - Plain text password to hash
   * @returns Promise resolving to the hashed password
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compare a plain text password with a hashed password
   * @param password - Plain text password
   * @param hash - Hashed password to compare against
   * @returns Promise resolving to true if passwords match, false otherwise
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate a JWT access token with 15 minute expiry
   * @param user - User object containing id, email, and role
   * @returns JWT access token string
   */
  static generateAccessToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiry as any,
    });
  }

  /**
   * Generate a JWT refresh token with 7 day expiry
   * @param user - User object containing id, email, and role
   * @returns JWT refresh token string
   */
  static generateRefreshToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiry as any,
    });
  }

  /**
   * Verify and decode a JWT token
   * @param token - JWT token string to verify
   * @param isRefreshToken - Whether this is a refresh token (default: false)
   * @returns Decoded token payload
   * @throws Error if token is invalid or expired
   */
  static verifyToken(token: string, isRefreshToken: boolean = false): TokenPayload {
    const secret = isRefreshToken ? config.jwt.refreshSecret : config.jwt.accessSecret;
    
    try {
      const decoded = jwt.verify(token, secret) as TokenPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw error;
    }
  }
}

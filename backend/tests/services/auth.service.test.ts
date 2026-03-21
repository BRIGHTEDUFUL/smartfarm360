import { AuthService } from '../../src/services/auth.service';
import jwt from 'jsonwebtoken';
import { config } from '../../src/config/env';

// Mock the setup to avoid database initialization for AuthService tests
jest.mock('../setup', () => ({}));

describe('AuthService', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    role: 'Consumer',
  };

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123';
      const hash = await AuthService.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await AuthService.hashPassword(password);
      const hash2 = await AuthService.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should use at least 10 salt rounds', async () => {
      const password = 'testPassword123';
      const hash = await AuthService.hashPassword(password);

      // bcrypt hashes start with $2b$ followed by cost factor
      // Format: $2b$10$... where 10 is the cost factor (salt rounds)
      const costFactor = parseInt(hash.split('$')[2]);
      expect(costFactor).toBeGreaterThanOrEqual(10);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'testPassword123';
      const hash = await AuthService.hashPassword(password);
      const result = await AuthService.comparePassword(password, hash);

      expect(result).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword456';
      const hash = await AuthService.hashPassword(password);
      const result = await AuthService.comparePassword(wrongPassword, hash);

      expect(result).toBe(false);
    });
  });

  describe('generateAccessToken', () => {
    it('should generate a valid JWT access token', () => {
      const token = AuthService.generateAccessToken(mockUser);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    it('should include user id, email, and role in token payload', () => {
      const token = AuthService.generateAccessToken(mockUser);
      const decoded = jwt.decode(token) as any;

      expect(decoded.userId).toBe(mockUser.id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.role);
    });

    it('should set expiry time', () => {
      const token = AuthService.generateAccessToken(mockUser);
      const decoded = jwt.decode(token) as any;

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid JWT refresh token', () => {
      const token = AuthService.generateRefreshToken(mockUser);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });

    it('should include user id, email, and role in token payload', () => {
      const token = AuthService.generateRefreshToken(mockUser);
      const decoded = jwt.decode(token) as any;

      expect(decoded.userId).toBe(mockUser.id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.role);
    });

    it('should have longer expiry than access token', () => {
      const accessToken = AuthService.generateAccessToken(mockUser);
      const refreshToken = AuthService.generateRefreshToken(mockUser);

      const accessDecoded = jwt.decode(accessToken) as any;
      const refreshDecoded = jwt.decode(refreshToken) as any;

      const accessExpiry = accessDecoded.exp - accessDecoded.iat;
      const refreshExpiry = refreshDecoded.exp - refreshDecoded.iat;

      expect(refreshExpiry).toBeGreaterThan(accessExpiry);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid access token', () => {
      const token = AuthService.generateAccessToken(mockUser);
      const decoded = AuthService.verifyToken(token);

      expect(decoded.userId).toBe(mockUser.id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.role);
    });

    it('should verify and decode a valid refresh token', () => {
      const token = AuthService.generateRefreshToken(mockUser);
      const decoded = AuthService.verifyToken(token, true);

      expect(decoded.userId).toBe(mockUser.id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.role);
    });

    it('should throw error for expired token', () => {
      // Create a token that expires immediately
      const expiredToken = jwt.sign(
        { userId: mockUser.id, email: mockUser.email, role: mockUser.role },
        config.jwt.accessSecret,
        { expiresIn: '0s' }
      );

      // Wait a moment to ensure token is expired
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(() => AuthService.verifyToken(expiredToken)).toThrow('Token has expired');
          resolve(undefined);
        }, 100);
      });
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => AuthService.verifyToken(invalidToken)).toThrow('Invalid token');
    });

    it('should throw error for token with wrong secret', () => {
      const tokenWithWrongSecret = jwt.sign(
        { userId: mockUser.id, email: mockUser.email, role: mockUser.role },
        'wrong-secret',
        { expiresIn: '15m' }
      );

      expect(() => AuthService.verifyToken(tokenWithWrongSecret)).toThrow('Invalid token');
    });

    it('should throw error when verifying access token as refresh token', () => {
      const accessToken = AuthService.generateAccessToken(mockUser);

      expect(() => AuthService.verifyToken(accessToken, true)).toThrow('Invalid token');
    });

    it('should throw error when verifying refresh token as access token', () => {
      const refreshToken = AuthService.generateRefreshToken(mockUser);

      expect(() => AuthService.verifyToken(refreshToken, false)).toThrow('Invalid token');
    });
  });
});

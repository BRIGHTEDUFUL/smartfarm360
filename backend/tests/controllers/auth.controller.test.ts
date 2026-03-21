import request from 'supertest';
import express, { Express } from 'express';
import { AuthController } from '../../src/controllers/auth.controller';
import { initDatabase, query, saveDatabase } from '../../src/config/database';
import { AuthService } from '../../src/services/auth.service';

describe('AuthController', () => {
  let app: Express;

  beforeAll(async () => {
    // Initialize database
    await initDatabase();

    // Setup Express app
    app = express();
    app.use(express.json());

    // Setup routes
    app.post('/api/auth/register', AuthController.registerValidation, AuthController.register);
    app.post('/api/auth/login', AuthController.loginValidation, AuthController.login);
    app.post('/api/auth/refresh', AuthController.refreshValidation, AuthController.refresh);
    app.post('/api/auth/logout', AuthController.logoutValidation, AuthController.logout);
  });

  beforeEach(async () => {
    // Clean up database before each test
    await query('DELETE FROM refresh_tokens', []);
    await query('DELETE FROM users', []);
    saveDatabase();
  });

  afterAll(() => {
    saveDatabase();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        email: 'farmer@test.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+233501234567',
        role: 'Farmer',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toMatchObject({
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        role: userData.role,
        status: 'Active',
      });
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();

      // Verify password is hashed
      const userResult = await query('SELECT password_hash FROM users WHERE email = ?', [userData.email]);
      expect(userResult.rows[0].password_hash).not.toBe(userData.password);
    });

    it('should reject registration with duplicate email', async () => {
      const userData = {
        email: 'duplicate@test.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+233501234567',
        role: 'Consumer',
      };

      // Register first user
      await request(app).post('/api/auth/register').send(userData).expect(201);

      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('DUPLICATE_EMAIL');
    });

    it('should reject registration with password less than 8 characters', async () => {
      const userData = {
        email: 'test@test.com',
        password: 'short',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+233501234567',
        role: 'Farmer',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_FAILED');
    });

    it('should reject registration with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+233501234567',
        role: 'Farmer',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_FAILED');
    });

    it('should reject registration with invalid role', async () => {
      const userData = {
        email: 'test@test.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+233501234567',
        role: 'InvalidRole',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_FAILED');
    });

    it('should reject registration with missing required fields', async () => {
      const userData = {
        email: 'test@test.com',
        password: 'password123',
        // Missing first_name, last_name, phone, role
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_FAILED');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      const password_hash = await AuthService.hashPassword('password123');
      await query(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['test@test.com', password_hash, 'John', 'Doe', '+233501234567', 'Farmer', 'Active']
      );
      saveDatabase();
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@test.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();

      // Verify refresh token is stored in database
      const tokenResult = await query('SELECT * FROM refresh_tokens WHERE user_id = ?', [response.body.data.user.id]);
      expect(tokenResult.rows.length).toBeGreaterThan(0);
    });

    it('should reject login with invalid email', async () => {
      const loginData = {
        email: 'nonexistent@test.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should reject login with invalid password', async () => {
      const loginData = {
        email: 'test@test.com',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should reject login for inactive user', async () => {
      // Deactivate the user
      await query('UPDATE users SET status = ? WHERE email = ?', ['Inactive', 'test@test.com']);
      saveDatabase();

      const loginData = {
        email: 'test@test.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ACCOUNT_INACTIVE');
    });

    it('should reject login with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_FAILED');
    });
  });

  describe('POST /api/auth/refresh', () => {
    let userId: number;
    let validRefreshToken: string;

    beforeEach(async () => {
      // Create a test user
      const password_hash = await AuthService.hashPassword('password123');
      await query(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['test@test.com', password_hash, 'John', 'Doe', '+233501234567', 'Farmer', 'Active']
      );

      const userResult = await query('SELECT id FROM users WHERE email = ?', ['test@test.com']);
      userId = userResult.rows[0].id;

      // Generate and store a valid refresh token
      validRefreshToken = AuthService.generateRefreshToken({
        id: userId,
        email: 'test@test.com',
        role: 'Farmer',
      });

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [userId, validRefreshToken, expiresAt.toISOString()]
      );
      saveDatabase();
    });

    it('should generate new access token with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: validRefreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();

      // Verify the new access token is valid
      const decoded = AuthService.verifyToken(response.body.data.accessToken, false);
      expect(decoded.userId).toBe(userId);
    });

    it('should reject refresh with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('TOKEN_INVALID');
    });

    it('should reject refresh with expired token in database', async () => {
      // Create a token with expired database entry
      const expiredDbToken = AuthService.generateRefreshToken({
        id: userId,
        email: 'test@test.com',
        role: 'Farmer',
      });

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() - 1); // Expired yesterday

      // Delete existing token first to avoid UNIQUE constraint
      await query('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
      
      await query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [userId, expiredDbToken, expiresAt.toISOString()]
      );
      saveDatabase();

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: expiredDbToken })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('TOKEN_INVALID');
    });

    it('should reject refresh with token not in database', async () => {
      // Generate a valid token but don't store it in database
      const unstoredToken = AuthService.generateRefreshToken({
        id: userId,
        email: 'test@test.com',
        role: 'Farmer',
      });

      // Delete existing tokens to ensure this one is not in database
      await query('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
      saveDatabase();

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: unstoredToken })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('TOKEN_INVALID');
    });

    it('should reject refresh for inactive user', async () => {
      // Deactivate the user
      await query('UPDATE users SET status = ? WHERE id = ?', ['Inactive', userId]);
      saveDatabase();

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: validRefreshToken })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('USER_NOT_FOUND');
    });
  });

  describe('POST /api/auth/logout', () => {
    let userId: number;
    let validRefreshToken: string;

    beforeEach(async () => {
      // Create a test user
      const password_hash = await AuthService.hashPassword('password123');
      await query(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['test@test.com', password_hash, 'John', 'Doe', '+233501234567', 'Farmer', 'Active']
      );

      const userResult = await query('SELECT id FROM users WHERE email = ?', ['test@test.com']);
      userId = userResult.rows[0].id;

      // Generate and store a valid refresh token
      validRefreshToken = AuthService.generateRefreshToken({
        id: userId,
        email: 'test@test.com',
        role: 'Farmer',
      });

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [userId, validRefreshToken, expiresAt.toISOString()]
      );
      saveDatabase();
    });

    it('should logout and delete refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken: validRefreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logged out successfully');

      // Verify token is deleted from database
      const tokenResult = await query('SELECT * FROM refresh_tokens WHERE token = ?', [validRefreshToken]);
      expect(tokenResult.rows.length).toBe(0);
    });

    it('should succeed even with non-existent token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken: 'non-existent-token' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should reject logout without refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_FAILED');
    });
  });
});

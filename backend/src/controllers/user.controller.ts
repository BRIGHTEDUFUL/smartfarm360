import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { validateUserCreation, validateUserUpdate } from '../utils/validation';

export class UserController {
  /**
   * Get all users with optional filtering
   * GET /api/users
   */
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const { search, role, status, page, limit } = req.query;

      const filters = {
        search: search as string,
        role: role as string,
        status: status as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined
      };

      const { users, total } = await UserService.getAllUsers(filters);
      const currentPage = filters.page || 1;
      const pageLimit = filters.limit || 20;
      const totalPages = Math.ceil(total / pageLimit);

      res.status(200).json({
        success: true,
        data: {
          users,
          total,
          page: currentPage,
          totalPages
        }
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve users'
        }
      });
    }
  }

  /**
   * Create a new user
   * POST /api/users
   */
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { first_name, last_name, email, password, phone, role, status } = req.body;

      // Validate input
      const validation = validateUserCreation(req.body);
      if (!validation.valid) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Input validation failed',
            details: validation.errors
          }
        });
        return;
      }

      // Check if email already exists
      const emailExists = await UserService.emailExists(email);
      if (emailExists) {
        res.status(400).json({
          success: false,
          error: {
            code: 'DUPLICATE_EMAIL',
            message: 'Email already registered'
          }
        });
        return;
      }

      // Create user
      const user = await UserService.createUser({
        email,
        password,
        first_name,
        last_name,
        phone,
        role,
        status: status || 'Active'
      });

      res.status(201).json({
        success: true,
        data: {
          user,
          message: 'User created successfully'
        }
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user'
        }
      });
    }
  }

  /**
   * Update an existing user
   * PUT /api/users/:id
   */
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const updates = req.body;

      // Validate input
      const validation = validateUserUpdate(updates);
      if (!validation.valid) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Input validation failed',
            details: validation.errors
          }
        });
        return;
      }

      // Check if email is being changed and already exists
      if (updates.email) {
        const emailExists = await UserService.emailExists(updates.email, userId);
        if (emailExists) {
          res.status(400).json({
            success: false,
            error: {
              code: 'DUPLICATE_EMAIL',
              message: 'Email already registered'
            }
          });
          return;
        }
      }

      // Get original user for audit details
      const originalUser = await UserService.getUserById(userId);
      if (!originalUser) {
        res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          }
        });
        return;
      }

      // Update user
      const user = await UserService.updateUser(userId, updates);

      // Store changed fields for audit
      const changes: Record<string, any> = {};
      for (const key of Object.keys(updates)) {
        if ((originalUser as any)[key] !== (user as any)[key]) {
          changes[key] = {
            from: (originalUser as any)[key],
            to: (user as any)[key]
          };
        }
      }

      res.status(200).json({
        success: true,
        data: {
          user,
          changes,
          message: 'User updated successfully'
        }
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update user'
        }
      });
    }
  }

  /**
   * Delete a user
   * DELETE /api/users/:id
   */
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);

      // Get user details for audit before deletion
      const user = await UserService.getUserById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          }
        });
        return;
      }

      // Delete user
      await UserService.deleteUser(userId);

      res.status(200).json({
        success: true,
        data: {
          message: 'User deleted successfully',
          deletedUser: {
            id: user.id,
            email: user.email,
            name: `${user.first_name} ${user.last_name}`
          }
        }
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete user'
        }
      });
    }
  }
}

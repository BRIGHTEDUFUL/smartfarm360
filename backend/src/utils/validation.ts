/**
 * Validation utility functions for user management
 */

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password length (minimum 8 characters)
 */
export function validatePassword(password: string): boolean {
  return Boolean(password && password.length >= 8);
}

/**
 * Validate role enum
 */
export function validateRole(role: string): boolean {
  const validRoles = ['Admin', 'Farmer', 'Consumer'];
  return validRoles.includes(role);
}

/**
 * Validate status enum
 */
export function validateStatus(status: string): boolean {
  const validStatuses = ['Active', 'Inactive', 'Suspended'];
  return validStatuses.includes(status);
}

/**
 * Validate name (not empty, max 100 characters)
 */
export function validateName(name: string): boolean {
  return Boolean(name && name.trim().length > 0 && name.length <= 100);
}

/**
 * Validate phone format (basic validation for Ghana numbers)
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return true; // Phone is optional
  
  // Remove spaces and dashes
  const cleanPhone = phone.replace(/[\s-]/g, '');
  
  // Ghana phone numbers: 10 digits starting with 0, or with country code +233
  const ghanaPhoneRegex = /^(\+233|0)[2-9]\d{8}$/;
  return ghanaPhoneRegex.test(cleanPhone);
}

/**
 * Validate all required fields for user creation
 */
export function validateUserCreation(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.first_name || !validateName(data.first_name)) {
    errors.push('First name is required and must be 1-100 characters');
  }

  if (!data.last_name || !validateName(data.last_name)) {
    errors.push('Last name is required and must be 1-100 characters');
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.password || !validatePassword(data.password)) {
    errors.push('Password must be at least 8 characters');
  }

  if (!data.role || !validateRole(data.role)) {
    errors.push('Role must be one of: Admin, Farmer, Consumer');
  }

  if (data.status && !validateStatus(data.status)) {
    errors.push('Status must be one of: Active, Inactive, Suspended');
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Invalid phone number format');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate fields for user update
 */
export function validateUserUpdate(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (data.first_name !== undefined && !validateName(data.first_name)) {
    errors.push('First name must be 1-100 characters');
  }

  if (data.last_name !== undefined && !validateName(data.last_name)) {
    errors.push('Last name must be 1-100 characters');
  }

  if (data.email !== undefined && !validateEmail(data.email)) {
    errors.push('Valid email is required');
  }

  if (data.role !== undefined && !validateRole(data.role)) {
    errors.push('Role must be one of: Admin, Farmer, Consumer');
  }

  if (data.status !== undefined && !validateStatus(data.status)) {
    errors.push('Status must be one of: Active, Inactive, Suspended');
  }

  if (data.phone !== undefined && !validatePhone(data.phone)) {
    errors.push('Invalid phone number format');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

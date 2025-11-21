import argon2 from 'argon2';

// Password policy configuration
export const PASSWORD_POLICY = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  bannedPatterns: [
    /password/i,
    /123456/,
    /qwerty/i,
    /admin/i,
    /letmein/i,
  ],
};

// Password validation errors
export class PasswordValidationError extends Error {
  constructor(message: string, public suggestions: string[] = []) {
    super(message);
    this.name = 'PasswordValidationError';
  }
}

/**
 * Validates password against security policy
 */
export function validatePassword(password: string): void {
  const errors: string[] = [];
  const suggestions: string[] = [];

  if (password.length < PASSWORD_POLICY.minLength) {
    errors.push(`Password must be at least ${PASSWORD_POLICY.minLength} characters long`);
    suggestions.push(`Use at least ${PASSWORD_POLICY.minLength} characters`);
  }

  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
    suggestions.push('Add an uppercase letter (A-Z)');
  }

  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
    suggestions.push('Add a lowercase letter (a-z)');
  }

  if (PASSWORD_POLICY.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
    suggestions.push('Add a number (0-9)');
  }

  if (PASSWORD_POLICY.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
    suggestions.push('Add a special character (!@#$%^&*()_+-=[]{}|;\':",./<>?)');
  }

  // Check for banned patterns
  for (const pattern of PASSWORD_POLICY.bannedPatterns) {
    if (pattern.test(password)) {
      errors.push('Password contains common patterns or words');
      suggestions.push('Avoid common words like "password", "admin", or sequential numbers');
      break;
    }
  }

  if (errors.length > 0) {
    const message = errors.join('. ') + '.';
    const exampleSuggestions = [
      'Example strong passwords:',
      '• MyS3cur3P@ssw0rd!',
      '• Tr0ub4dor&3',
      '• C0mplex!Pa$$w0rd2024'
    ];
    throw new PasswordValidationError(message, [...suggestions, ...exampleSuggestions]);
  }
}

/**
 * Hashes a password using Argon2id
 */
export async function hashPassword(password: string): Promise<string> {
  validatePassword(password);
  
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3,
    parallelism: 1,
  });
}

/**
 * Verifies a password against its hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch (error) {
    // If verification fails due to hash format issues, return false
    return false;
  }
}

/**
 * Generates a strong random password
 */
export function generateSecurePassword(length: number = 16): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  
  let password = '';
  
  // Ensure at least one character from each required category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
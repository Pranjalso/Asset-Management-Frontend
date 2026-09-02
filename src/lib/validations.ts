// Validation utilities for form fields

export const validators = {
  // Email validation
  email: (value: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'Email is required';
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return null;
  },

  // Phone validation (Indian format)
  phone: (value: string): string | null => {
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    if (!value) return 'Phone number is required';
    if (!phoneRegex.test(value.replace(/[\s-]/g, ''))) return 'Please enter a valid phone number';
    return null;
  },

  // Required field validation
  required: (value: string, fieldName: string = 'This field'): string | null => {
    if (!value || value.trim() === '') return `${fieldName} is required`;
    return null;
  },

  // Minimum length validation
  minLength: (value: string, min: number, fieldName: string = 'This field'): string | null => {
    if (!value || value.length < min) return `${fieldName} must be at least ${min} characters`;
    return null;
  },

  // Maximum length validation
  maxLength: (value: string, max: number, fieldName: string = 'This field'): string | null => {
    if (value && value.length > max) return `${fieldName} must not exceed ${max} characters`;
    return null;
  },

  // GST validation (Indian format)
  gst: (value: string): string | null => {
    if (!value) return null; // GST is optional
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(value)) return 'Please enter a valid GST number';
    return null;
  },

  // Pincode validation (Indian format)
  pincode: (value: string): string | null => {
    if (!value) return null; // Pincode is optional
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(value)) return 'Please enter a valid 6-digit pincode';
    return null;
  },

  // Password validation
  password: (value: string): string | null => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
    return null;
  },

  // Confirm password validation
  confirmPassword: (value: string, originalPassword: string): string | null => {
    if (!value) return 'Please confirm your password';
    if (value !== originalPassword) return 'Passwords do not match';
    return null;
  },

  // Number validation
  number: (value: string, fieldName: string = 'This field'): string | null => {
    if (!value) return `${fieldName} is required`;
    if (isNaN(Number(value))) return `${fieldName} must be a valid number`;
    return null;
  },

  // Positive number validation
  positiveNumber: (value: string, fieldName: string = 'This field'): string | null => {
    const numError = validators.number(value, fieldName);
    if (numError) return numError;
    if (Number(value) <= 0) return `${fieldName} must be greater than 0`;
    return null;
  },

  // Date validation
  date: (value: string, fieldName: string = 'This field'): string | null => {
    if (!value) return `${fieldName} is required`;
    const date = new Date(value);
    if (isNaN(date.getTime())) return `${fieldName} must be a valid date`;
    return null;
  },

  // Future date validation
  futureDate: (value: string, fieldName: string = 'This field'): string | null => {
    const dateError = validators.date(value, fieldName);
    if (dateError) return dateError;
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return `${fieldName} must be a future date`;
    return null;
  },

  // URL validation
  url: (value: string): string | null => {
    if (!value) return null; // URL is optional
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  }
};

// Form validation helper
export const validateForm = (
  data: Record<string, string>,
  rules: Record<string, (value: string) => string | null>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  for (const [field, validator] of Object.entries(rules)) {
    const error = validator(data[field] || '');
    if (error) {
      errors[field] = error;
    }
  }
  
  return errors;
};

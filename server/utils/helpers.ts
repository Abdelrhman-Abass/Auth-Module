import bcrypt from "bcryptjs";

/**
 * Hash password using bcrypt with try/catch
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }
};


/**
 * Compare plain password with hash
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error("Error comparing password:", error);
    throw new Error("Failed to compare password");
  }
};

/**
 * Remove sensitive fields from user object
 */
export const formatUserResponse = (user: any) => {
  try {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  } catch (error) {
    console.error("Error formatting user response:", error);
    throw new Error("Failed to format user data");
  }
};

/**
 * Standardized success response
 */
export const createSuccessResponse = <T>(
  message: string,
  data?: T
): {
  success: true;
  message: string;
  data?: T;
  timestamp: string;
} => {
  return {
    success: true,
    message,
    ...(data && { data }),
    timestamp: new Date().toISOString(),
  };
};

/**
 * Standardized error response
 */
export const createErrorResponse = (
  message: string, errors: any = null): {
    success: false;
    message: string;
    timestamp: string;
    errors?: any;
  } => {
  return {
    success: false,
    message,
    timestamp: new Date().toISOString(),
    errors
  };
};

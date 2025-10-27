export const MESSAGES = {
    USER: {
      CREATED: "User created successfully",
      UPDATED: "User updated successfully",
      DELETED: "User deleted successfully",
      DETAIL: "User details fetched successfully",
      LISTED: "User list fetched successfully",
      EXISTS: "Email already exists",
      NOT_FOUND: "User not found"
    },
    AUTH: {
      LOGIN_SUCCESS: "Login successful",
      INVALID_CREDENTIALS: "Invalid email or password"
    },
    COMMON: {
      SERVER_ERROR: "Internal server error",
      UNAUTHORIZED: "Unauthorized access"
    }
  } as const;
  
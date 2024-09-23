export const ERROR_MESSAGES = {
    INVALID_USERNAME_PASSWORD: "Invalid username or password",
    VALIDATION_ERROR: "Validation error",
    NOT_AUTHENTICATED: "Not authenticated",
    ACCESS_TOKEN_INVALID: "Token invalid",
    NOT_AUTHORIZED: "Not authorized",
    RECORD_NOT_FOUND: "Record not found",
    RECORD_ALREADY_EXIST: "Record already exists",
    TOKEN_EXPIRED: "Token has expired",
    EMAIL_FAILED: "Failed to send email to your account",
    INVALID_FILE: "Invalid file",
    FILE_MISSING: "File missing"
};

export const ERROR_CODES = {

    INVALID_USERNAME_PASSWORD: 100,
    VALIDATION_ERROR: 101,
    NOT_AUTHENTICATED: 102,
    ACCESS_TOKEN_INVALID: 103,
    NOT_AUTHORIZED: 104,
    RECORD_NOT_FOUND: 105,
    RECORD_ALREADY_EXIST: 106,
    TOKEN_EXPIRED: 107,
    EMAIL_FAILED: 108,
    INVALID_FILE: 109,
    FILE_MISSING: 110 
}

export const getErrorCode = (errorMsg: string): number => {
    
    const errorMessage = Object.keys(ERROR_MESSAGES).find(key => ERROR_MESSAGES[key] === errorMsg);
    
    return ERROR_CODES[errorMessage];
}
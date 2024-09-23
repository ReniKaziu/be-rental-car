import { Response } from "express";
import { getErrorCode } from "./ErrorMessages";

interface SingleError {
    key: string;
    message: string
}

export class ErrorResponse {
    
    message: string;
    error_code: number; 
    errors?: SingleError[] = [];
    
    constructor(errorMessage: string, joiErrorDetails?: Array<any>) {
        
        this.message = errorMessage;
        this.error_code = getErrorCode(errorMessage);

        if(joiErrorDetails){

            let errors = [];

            joiErrorDetails.forEach(function(detail) {
                errors.push({
                    key: detail.path[0],
                    message: detail.message
                });
            });
            
            this.errors = errors;
        }
    }
}
import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../utilities/ErrorResponse";
import { ERROR_MESSAGES } from "../utilities/ErrorMessages";

export class PermissionMiddleware {

    static checkAllowedPermissions = (roles: Array<string>) => {

        return async (req: Request, res: Response, next: NextFunction) => {

           const { userRole } = res.locals.jwt;

           if(userRole && roles.indexOf(userRole) > -1){
               next();
           } else {
                res.status(403).send(ERROR_MESSAGES.NOT_AUTHORIZED)
           }
        };
    }

    static checkMeOrPermissionsAllowed = (roles: Array<string>) => {

        return async (req: Request, res: Response, next: NextFunction) => {
            
            const { userId, userRole } = res.locals.jwt;

            if(req.params && req.params.userId && req.params.userId === userId){
                return next();
            }
            
            if(userRole && roles.indexOf(userRole) > -1){
                
                next();

            } else {
            
                res.status(403).send(new ErrorResponse(ERROR_MESSAGES.NOT_AUTHORIZED))
            }
        };
    }

    static checkNotMe = async (req: Request, res: Response, next: NextFunction) => {
            
        const { userId } = res.locals.jwt;

        if(req.params && req.params.userId && req.params.userId === userId){
            return res.status(403).send(ERROR_MESSAGES.NOT_AUTHORIZED)
        }

        next();
    }
}
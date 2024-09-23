import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { ERROR_MESSAGES } from "../../common/utilities/ErrorMessages";
import { ErrorResponse } from "../../common/utilities/ErrorResponse";
const Joi = require('@hapi/joi');

export class AuthenticationMiddleware {

    static hasLoginValidFields = async (req: Request, res: Response, next: NextFunction) => {

        //Register input
        const loginInput = Joi.object().keys({
            username: Joi.string().optional(),
            email: Joi.string().optional(),
            password: Joi.string().required(),
        });

        const result = loginInput.validate(req.body, { abortEarly: false });

        if (result.error === null) {
            next();
        } else {
            return res.status(400).send(new ErrorResponse(ERROR_MESSAGES.VALIDATION_ERROR, result.error.details));
        }
    }

    static checkJwtToken = async (req: Request, res: Response, next: NextFunction) => {

        const token = req.header('Authorization');
        if (token) {

            try {
                const jwtPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
                res.locals.jwt = jwtPayload;

                next();

            } catch (error) {
                console.log(error);
                return res.status(401).send(new ErrorResponse(ERROR_MESSAGES.ACCESS_TOKEN_INVALID));
            }

        } else {
            return res.status(401).send(new ErrorResponse(ERROR_MESSAGES.NOT_AUTHENTICATED));
        }
    }

    static validateRefreshTokenInput = async (req: Request, res: Response, next: NextFunction) => {

        const refreshTokenInput = Joi.object().keys({
            refresh_token: Joi.string().required()
        });

        const result = refreshTokenInput.validate(req.body, { abortEarly: false });

        if (result.error === null) {
            next();
        } else {
            return res.status(400).send(new ErrorResponse(ERROR_MESSAGES.VALIDATION_ERROR, result.error.details));
        }
    }
}
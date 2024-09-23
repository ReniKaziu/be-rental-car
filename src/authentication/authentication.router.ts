import * as express from "express";
import { AuthenticationMiddleware } from "./middlewares/authentication.middleware";
import { ProfileMiddleware } from "./middlewares/profile.middleware";
import { AuthenticationController } from "./controllers/authentication.controller";
import { ProfileController } from "./controllers/profile.controller";
import { UserMiddleware } from "../user/middlewares/user.middleware";

export class AuthenticationRouter {
    
    static configRoutes = (app: express.Application) => {

        app.post("/login", [
            AuthenticationMiddleware.hasLoginValidFields,
            AuthenticationController.login
        ]);

        app.post("/refresh-token", [
            AuthenticationMiddleware.validateRefreshTokenInput,
            AuthenticationController.refreshToken
        ]);

        app.post("/logout", [
            AuthenticationMiddleware.checkJwtToken,
            AuthenticationController.logout
        ]);

        //Register route
        app.post("/register", [
            ProfileMiddleware.validateRegisterInput,
            UserMiddleware.checkUserExistance('email', 'body.email', false),
            ProfileController.register
        ]);
        
        app.post("/profile/verify", [
            ProfileMiddleware.validateVerifyInput,
            ProfileController.verfiy
        ]);

        app.post('/profile/forgot-password', [
            ProfileMiddleware.validateForgotPasswordInput,
            ProfileController.forgotPassword
        ]);

		app.post('/profile/change-password', [
            ProfileMiddleware.validateChangePasswordInput,
			ProfileController.changePassword
        ]);
        
        app.get('/profile/me', [
            AuthenticationMiddleware.checkJwtToken,
			ProfileController.me
        ]);
    }
}
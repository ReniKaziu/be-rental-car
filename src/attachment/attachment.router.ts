import * as express from "express";
import { UploadMiddleware } from "./middlewares/upload.middleware";
import { AttachmentController } from "./controllers/attachment.controller";

export class AttachmentRouter {
    
    static configRoutes = (app: express.Application) => {

        app.post("/attachments/upload", [
            UploadMiddleware.validateFileUpload('attachment', ["jpg", "jpeg", "png", "gif"], 1),
            AttachmentController.upload
        ]);
    }
}
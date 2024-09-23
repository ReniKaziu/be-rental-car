import { Request, Response } from "express";
import { Attachment } from "../entities/attachment.entity";
import { File } from "../../common/utilities/File";
import { getRepository } from "typeorm";
import { SuccessResponse } from "../../common/utilities/SuccessResponse";
import { ErrorResponse } from "../../common/utilities/ErrorResponse";
import { ERROR_MESSAGES } from "../../common/utilities/ErrorMessages";
import { Helper } from "../../common/utilities/Helper";

export class AttachmentController {

    static upload = async (request: Request, response: Response) => {

        const file = request.file;

        if (Helper.isDefined(file)) {
            
            const attachment = new Attachment();
            attachment.name = file.filename;
            attachment.originalName = file.originalname;
            attachment.mimeType = file.mimetype;
            attachment.sizeInBytes = file.size;
            attachment.extension = File.getFileExtension(file.originalname);
            attachment.path = file.path;

            const attachmentRepo = getRepository(Attachment);

            await attachmentRepo.save(attachment);

            response.status(201).send(new SuccessResponse(attachment));
        } else {
            response.status(400).send(new ErrorResponse(ERROR_MESSAGES.FILE_MISSING));
        }
    }
}



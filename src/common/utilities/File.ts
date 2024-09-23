require('dotenv').config();
const fs = require('fs-extra')

interface FileInfo {
    filePath: string;
    type: string;
    extension: string;
}

export class File {

    static insertBase64Media = async (fileData: string, postFix: string): Promise<FileInfo>  => {

        const uploadPath = process.env.IMAGE_FOLDER;

        // In case the '/uploads' directoy doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
    
        // Decoding the base64 image
        const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        const type = matches[1].split("/")[0]
        const extension = matches[1].split("/")[1];
    
        const bufferData = new Buffer(matches[2], 'base64');
        const filename = new Date().getTime().toString() + '_' + postFix;
        const filePath = `${uploadPath}${filename}.${extension}`;

        await fs.writeFile(filePath, bufferData);

        return  {
            filePath: filePath,
            type: type,
            extension: extension
        }
    }

    static deleteMedia = (filePath: string) => {

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    static getFileExtension = (filename:string):string => {
        
        const nameParts = filename.split('.');
        
        return nameParts[nameParts.length-1];
    }
}

export class SuccessResponse {
    
    data: any;
    message?: string;
    
    constructor(data: any, message?: string) {

        this.data = data;
        
        if(message){
            this.message = message;
        }
    }
}
let aesjs = require("aes-js");

export class Functions {
    public key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
    constructor() {}

    static formatDate(currentDate):string {
        
        let date = new Date(currentDate);
        let month = "" + (date.getMonth() + 1);
        let day = "" + date.getDate();
        let year = date.getFullYear();
        let hour = "" + date.getHours();
        let minute = "" + date.getMinutes();
        let second = "" + date.getSeconds();

        if (month.length < 2) { month = "0" + month; }
        if (day.length < 2) { day = "0" + day; }
        if (hour.length < 2) { hour = "0" + hour; }
        if (minute.length < 2) { minute = "0" + minute; }
        if (second.length < 2) { second = "0" + second; }

        let datePart = [year, month, day].join("-");
        let hourPart = [hour, minute, second].join(":");
        return [datePart, hourPart].join(" ");
    }

    public encrypt(userSessionId, userId) {

        // Convert text to bytes
        let text = userSessionId + "_" + userId + "_" + process.env.JWT_SECRET_KEY + new Date().getTime();
        let textBytes = aesjs.utils.utf8.toBytes(text);
        // The counter is optional, and if omitted will begin at 1
        let aesCtr = new aesjs.ModeOfOperation.ctr(this.key, new aesjs.Counter(5));
        let encryptedBytes = aesCtr.encrypt(textBytes);

        // To print or store the binary data, you may convert it to hex
        let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
        return encryptedHex;
    }

    public decrypt(token) {

        // When ready to decrypt the hex string, convert it back to bytes
        let encryptedBytes = aesjs.utils.hex.toBytes(token);

        // The counter mode of operation maintains internal state, so to
        // decrypt a new instance must be instantiated.
        let aesCtr = new aesjs.ModeOfOperation.ctr(this.key, new aesjs.Counter(5));
        let decryptedBytes = aesCtr.decrypt(encryptedBytes);

        // Convert our bytes back into text
        let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

        return {
            userSessionId: decryptedText.split("_")[0],
            userId: decryptedText.split("_")[1],
        };
    }

    static isNotExpired(expiration:Date){
 
        if(expiration) {
            const nowTimestamp = Date.now();
            const expirationTimestamp = new Date(expiration).getTime(); 
            return expirationTimestamp > nowTimestamp;
        } else {
            return false;
        }
    }

    static getObjectPath(object: any, path: Array<string>){

        let pathValue = object;
        path.forEach(element => {
            pathValue = pathValue[element];
        });
        return pathValue;
    }

    static getDateAfter(value:number|string, unit: 'd'|'h'|'m'):Date {
        
        let offset;
        const intValue = (typeof value === 'string') ? parseInt(value) : value;
        switch(unit){
            case 'd':
                offset = intValue * 24 * 60 * 60 * 1000;
                break;
            case 'h':
                offset = intValue * 60 * 60 * 1000;
                break;
            default:
                offset = intValue * 60 * 1000;
                break;         
        }
        const now = new Date();
        const res = now.setTime(now.getTime() + offset);
        return new Date(res);
    }
}

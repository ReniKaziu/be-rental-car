require("dotenv").config();
export class Mailer {
  public transporter: any;
  constructor() {
    // this.transporter = nodemailer.createTransport({
    //     host: 'server.rtechno-labs.com',
    //     port: '465',
    //     secure: 'true',
    //     auth: {
    //         // user: process.env.EMAIL_USERNAME,
    //         user: 'admin@scraper.rtechno-labs.com',
    //         //pass: process.env.EMAIL_PASSWORD,
    //         pass: 'x4s8BCmdoCq8',
    //     },
    // });
  }

  public async sendMail(emailTo: String, subject: String, bodyHtml: String) {
    let mailOptions = {
      from: '"Scraper" <' + process.env.EMAIL_USERNAME + ">", // sender address
      to: emailTo, // list of receivers
      subject, // Subject line
      html: bodyHtml,
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  }
}

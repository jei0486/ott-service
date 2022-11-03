const nodemailer = require('nodemailer');
// 메일발송 객체
const mailSender = {
  // 메일발송 함수
  sendGmail: function (param) {
    var transporter = nodemailer.createTransport({
      service: 'gmail',   // 메일 보내는 곳
      prot: 587,
      host: 'smtp.gmail.com',  
      secure: false,  
      requireTLS: true ,
      auth: {
        user: process.env.ADMIN_EMAIL_ID,  // 보내는 메일의 주소
        pass: process.env.ADMIN_EMAIL_PW   // 보내는 메일의 비밀번호
      }
});
    // 메일 옵션
    var mailOptions = {
      from: process.env.ADMIN_EMAIL_ID, // 보내는 메일의 주소
      to: param.toEmail, // 수신할 이메일
      subject: "회원가입을 진행해주세요",
      html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>회원가입을 진행해주세요</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin: 0; padding: 0;">
          <table border="1" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td bgcolor="#70bbd9">
                <h2 align="center"><a href=${process.env.SERVER_HOST}/auth/signupToken/?token=${param.signupToken}>Click</a> to verify your email</h2>
              </td>
            </tr>
          </table>
        </body>
      </html>
      `,
    };
    
    // 메일 발송    
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  }
}

module.exports = mailSender;
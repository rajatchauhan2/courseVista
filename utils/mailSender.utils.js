const { body } = require('express-validator');
const nodemailer = require('nodemailer');

const mailSender = async (email, title, body)=>{
    try {
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        })
        let info = await transporter.sendMail({
            from:'CourseVista || Ultimate Learning Hub - Chandigarh University',
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        });
        console.log('Message sent: %s', info.messageId);
        return info.messageId;
        
    } catch (error) {
        console.log(error.massage);
        
    }
}
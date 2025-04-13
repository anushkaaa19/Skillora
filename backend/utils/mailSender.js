const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST, // should be 'smtp.gmail.com'
            port: 465, // or 587
            secure: true, // true for port 465, false for port 587
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            tls: {
                rejectUnauthorized: false // use only in dev to bypass cert errors
            },
            debug:true
        });

        const info = await transporter.sendMail({
            from: `"StudyNotion || by Aniruddha Gade" <${process.env.MAIL_USER}>`,
            to: email,
            subject: title,
            html: body
        });

        return info;
    } catch (error) {
        console.log('Error while sending mail (mailSender):', error.message);
    }
};

module.exports = mailSender;

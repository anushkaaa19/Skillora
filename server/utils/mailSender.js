const nodemailer = require('nodemailer');

const mailSender = async (email, subject, htmlBody) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 465,
      secure: Number(process.env.MAIL_PORT) === 465,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      logger: true,
      debug: true,
    });

    // Test SMTP connection
    await transporter.verify();
    console.log('[mailSender] SMTP verified successfully');

    const info = await transporter.sendMail({
      from: `"Skillora" <${process.env.MAIL_USER}>`,
      to: email,
      subject,
      html: htmlBody,
    });

    console.log('[mailSender] Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('[mailSender] Failed to send email:', error.message);
    return false;
  }
};

module.exports = mailSender;

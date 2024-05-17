const nodemailer = require('nodemailer');

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const notificationEmail = process.env.NOTIFICATION_EMAIL;

const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false,
    auth: {
        user: smtpUser,
        pass: smtpPass,
    },
});

const sendEmailNotification = async (subject, text) => {
    const mailOptions = {
        from: smtpUser,
        to: notificationEmail,
        subject: subject,
        text: text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmailNotification;

const { createTransport } = require('nodemailer');
const { google } = require('googleapis');

const OAuth2Client = new google.auth.OAuth2(
    process.env.CLIENTID,
    process.env.CLIENTSECRET,
    process.env.REDIRECTURL
);

OAuth2Client.setCredentials({ refresh_token: process.env.REFRESHTOKEN });

/**
 * Function to create a nodemailer transporter using OAuth2 authentication
 * @returns {Promise<import('nodemailer').Transporter|null>} - A promise that resolves to the nodemailer transporter or null if an error occurs
 * @async
 * @throws {Error} - Throws an error if creating the transporter fails
 * @example
 * // Create a transporter and send an email
 * createTransporter().then(transporter => {
 *   if (transporter) {
 *     transporter.sendMail({
 *       from: 'sender@example.com',
 *       to: 'recipient@example.com',
 *       subject: 'Test Email',
 *       text: 'This is a test email'
 *     }, (err, info) => {
 *       if (err) {
 *         console.error('Error sending email:', err);
 *       } else {
 *         console.log('Email sent:', info.response);
 *       }
 *     });
 *   } else {
 *     console.error('Failed to create transporter');
 *   }
 * });
 */
async function createTransporter() {
    try {
        return createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.USER,
                clientId: process.env.CLIENTID,
                clientSecret: process.env.CLIENTSECRET,
                refreshToken: process.env.REFRESHTOKEN,
            },
        });
    } catch (error) {
        console.error('Error creating transporter:', error.message);
        return null;
    }
}

module.exports = { createTransporter };

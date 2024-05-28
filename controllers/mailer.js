const { createTransport } = require('nodemailer');
const { google } = require('googleapis');

const OAuth2Client = new google.auth.OAuth2(
    process.env.CLIENTID,
    process.env.CLIENTSECRET,
    process.env.REDIRECTURL
);

OAuth2Client.setCredentials({ refresh_token: process.env.REFRESHTOKEN });

async function createTransporter() {
    try {
        const accessToken = await OAuth2Client.getAccessToken();
        if (accessToken.token) {
            return createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: process.env.USER,
                    clientId: process.env.CLIENTID,
                    clientSecret: process.env.CLIENTSECRET,
                    refreshToken: process.env.REFRESHTOKEN,
                    accessToken: accessToken.token,
                },
            });
        } else {
            throw new Error('Failed to obtain access token');
        }
    } catch (error) {
        console.error('Error creating transporter:', error.message);
        return null;
    }
}

module.exports = { createTransporter };

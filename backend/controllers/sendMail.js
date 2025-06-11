const nodemailer = require('nodemailer')
const { google } = require('googleapis')

const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground'

const {
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  SENDER_EMAIL_ADDRESS
} = process.env

const oauth2Client = new google.auth.OAuth2(
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  OAUTH_PLAYGROUND
)

// 📧 send mail function
const sendEmail = async (to, url, txt) => {
  try {
    // Set refresh token
    oauth2Client.setCredentials({
      refresh_token: MAILING_SERVICE_REFRESH_TOKEN
    })

    // Fetch access token
    const { token } = await oauth2Client.getAccessToken()

    // Create transport
    const smtpTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: SENDER_EMAIL_ADDRESS,
        clientId: MAILING_SERVICE_CLIENT_ID,
        clientSecret: MAILING_SERVICE_CLIENT_SECRET,
        refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
        accessToken: token
      }
    })

    // Mail content
    const mailOptions = {
      from: SENDER_EMAIL_ADDRESS,
      to,
      subject: 'Product Listing verification mail',
      html: `
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
          <h2 style="text-align: center; text-transform: uppercase;color: teal;">Product Listing</h2>
          <p>Congratulations! You're almost set to start using Product Listing.
            Just click the button below to validate your email address.
          </p>
          <a href="${url}" style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">
            ${txt}
          </a>
          <p>If the button doesn't work for any reason, you can also click on the link below:</p>
          <div>${url}</div>
        </div>
      `
    }

    // Send email
    const result = await smtpTransport.sendMail(mailOptions)
    console.log("Mail sent:", result.messageId)
    return result

  } catch (err) {
    console.error("Failed to send email:", err)
    throw err
  }
}

module.exports = sendEmail

import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "81cf56002@smtp-brevo.com",
    pass: "zXfYT6DESvd4xbpO",
  },
  debug: true, // Enables SMTP debug information
  logger: true,
});

export default transporter;
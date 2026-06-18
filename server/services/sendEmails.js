const nodemailer = require("nodemailer");

// console.log(process.env.EMAIL_USER);
// console.log(process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

   pool: true,

    maxConnections: 5,

    maxMessages: 100
});

const sendEmail = async ({
  to,
  subject,
  html,
}) => {

  try {

    const info = await transporter.sendMail({
      from: `"Jain Ayurvedic Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent");
    console.log(info);

  } catch (err) {

    console.log("EMAIL ERROR:", err);

  }
};

module.exports = sendEmail;
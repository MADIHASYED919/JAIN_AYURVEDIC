const express = require("express");

const router = express.Router();

const sendEmail = require("../services/sendEmails")

router.get("/", async (req, res) => {

  await sendEmail({

    to: "s.madiha7774@gmail.com",

    subject: "Test Email",

    html: `
      <h1>Jain Store Email Working ✅</h1>
      <p>Your email system is successfully configured.</p>
    `,
  });

  res.send("Email Sent");
});

module.exports = router;
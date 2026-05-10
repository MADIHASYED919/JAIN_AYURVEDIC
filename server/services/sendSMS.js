const axios = require("axios");

const sendSMS = async (
  phone,
  message
) => {

  try {

    const response =
      await axios.post(

        "https://control.msg91.com/api/v5/flow/",

        {

          sender: "JAINST",

          route: "4",

          country: "91",

          sms: [

            {
              message,

              to: [phone]
            }

          ]

        },

        {

          headers: {

            authkey:
              process.env.MSG91_API_KEY,

            "Content-Type":
              "application/json"

          }

        }
      );

    console.log(
      "SMS SENT:",
      response.data
    );

  } catch (err) {

    console.log(
      "SMS ERROR:",
      err.response?.data ||
      err.message
    );

  }

};

module.exports = sendSMS;
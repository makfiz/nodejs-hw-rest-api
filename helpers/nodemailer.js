const nodemailer = require('nodemailer');

const { AUTHMetaPass } = require('../config');

async function verificationTokenSender(email, verificationToken) {
  const config = {
    host: 'smtp.meta.ua',
    port: 465,
    secure: true,
    auth: {
      user: 'devmai1@meta.ua',
      pass: AUTHMetaPass,
    },
  };

  const emailOptions = {
    from: 'devmai1@meta.ua',
    to: email,
    subject: 'email verification',
    text: `Hello, to verify your mail, follow the link: api/users/verify/${verificationToken}`,
    html: `<b>Hello, to verify your mail, follow the link: api/users/verify/${verificationToken}<b/>`,
  };

  const transporter = nodemailer.createTransport(config);
  try {
    const info = await transporter.sendMail(emailOptions);
    console.log(info);
    return info;
  } catch (error) {
    console.log(error);
    return { error };
  }
}

module.exports = { verificationTokenSender };

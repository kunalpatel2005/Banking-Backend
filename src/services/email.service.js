require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Kunal BHAI" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendregisteremail (userEmail,name){
    const subject="welcome to Advance-Backend-Project"
    const text = `hello ${name},\n\n thanks for registration at our website`
    const html = `<p>ok ${name},</p><p>thanks you`
    await sendEmail(userEmail,subject,text,html);
}
async function sendtransactionemail(userEmail, name, amount, toaccount){
    const subject="Transaction Successfull"
    const text = `${name},your transaction of ${amount}Rs is successfully transfer to ${toaccount}`
    const html = `<p>account no is ${toaccount}</p><p>thanks you`
    await sendEmail(userEmail,subject,text,html);
}
async function sendtransactionfailemail(userEmail, name, amount, toaccount){
    const subject="Transaction failed"
    const text = `${name},your transaction of ${amount}Rs is failed `
    const html = `<p>account no is ${toaccount}</p><p>thanks you`
    await sendEmail(userEmail,subject,text,html);
}


module.exports = {sendregisteremail,sendtransactionemail,sendtransactionfailemail};


const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'f1e9693d5bb9b1', // generated ethereal user
        pass: 'b22669df9f3a5f' // generated ethereal password
    }
});

module.exports = transporter;
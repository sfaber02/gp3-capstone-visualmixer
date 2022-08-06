const nodemailer = require("nodemailer");

const sendConfirmationEmail = async (newUser, token) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        auth: {
            user: "apikey",
            pass: process.env.SENDGRID_API_KEY,
        },
    });

    let sender = "verifymixle@gmail.com";

    const url = `${process.env.URL}/verify/${token}`;

    transporter.sendMail(
        {
            to: `${newUser.username} <${newUser.email}>`, // recipient email
            from: `Mixle Support <${sender}>`, // verified sender email
            subject: "Please verify your Mixle Account", // Subject line
            html: `Press <a href=${url}> here </a> to verify your email. Thanks!`, // html body
        },
        function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        }
    );
};

module.exports = sendConfirmationEmail;

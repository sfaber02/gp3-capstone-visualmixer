const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");
const jwt = require("jsonwebtoken");

const sendConfirmationEmail = async (newUser) => {
    const transporter = nodemailer.createTransport(
        nodemailerSendgrid({
            apiKey: process.env.SENDGRID_API_KEY
        })
        //     {
    //     service: "SendGrid",
    //     port: 587,
    //     auth: {
    //         user: "hectorilarraza1414@gmail.com",
    //         pass: process.env.SENDGRID_API_KEY
    //     }
    // }
    );

    const token = await jwt.sign(
            { id: newUser.user_id },
            process.env.SECRET_KEY
        );

    let sender = "hcyqnhevwdgzfwhlxl@nthrl.com";
    const url = `http://localhost:3000/verify/${token}`;
    let mailOptions = {
        from: sender,
        to: `${newUser.username} <${newUser.email}>`,
        subject: "Email Confirmation",
        html: `Press <a href=${url}> here </a> to verify your email. Thanks`
    };

    transporter.sendMail(mailOptions, function(err, res) {
        if(err){
            console.log(err);
            res.status(400).json({
                error: err,
            });
        }else{
            res.status(200).send("Message sent");
        }   
    });
}

module.exports = sendConfirmationEmail;
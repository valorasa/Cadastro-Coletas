// const nodemailer = require("nodemailer");

// const sendEmail = async (emailData) => {
//     try {
//         //transporter
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: process.env.REACT_APP_SEND_MAIL_VALORA,
//                 pass: process.env.REACT_APP_PASSWORD_MAIL_VALORA,
//             },
//         });

//         //send email
//         await transporter.sendMail({
//             from: process.env.REACT_APP_SEND_MAIL_VALORA,
//             to: "edjunior.mota18@gmail.com",
//             subject: "qualquer coisa",
//             text: `o usuario teste`,
//             html: `<p>teste</p>`
//         });

//         transporter.close();
//     } catch (err) {
//         throw new (err.message, 400);
//     }
// };

// module.exports = sendEmail;
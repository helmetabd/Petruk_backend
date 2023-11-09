import nodemailer from "nodemailer";
import Handlebars from "handlebars";
import fs from "fs"
import path from "path"
import dotenv from "dotenv";
import REQUEST_TEMPLATE from "../template/requestResetPassword.js";

dotenv.config();
// console.log(process.env.EMAIL_PASSWORD)

export const sendEmail = async (email, subject, payload, template) => {
    try {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            // host: process.env.EMAIL_HOST,
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.PASSWORD_GMAIL, // naturally, replace both with your real credentials or an application-specific password
            },
        });

        // const source = fs.readFileSync(path.join(__dirname, template), "utf8");
        // console.log(source);
        // const compiledTemplate = Handlebars.compile(source);
        const options = {
            from: process.env.FROM_EMAIL,
            to: email,
            subject: subject,
            // html: compiledTemplate(payload),
            html: REQUEST_TEMPLATE(payload, subject, template),
        };

        // Send email
        transporter.sendMail(options, (error, info) => {
            if (error) {
                return error;
            } else {
                return info
            }
        });
    } catch (error) {
        return error;
    }
};

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/

import nodemailer from "nodemailer";

import {EnvVariable, getEnvVariable} from "./get-env-variable";

type SendMailOptions = {
  to: string;
  subject: string;
} & ({text: string; html?: never} | {text?: never; html: string});

const mailHost = getEnvVariable(EnvVariable.SMTP_HOST);
const mailPort = getEnvVariable(EnvVariable.SMTP_PORT);
const mailUser = getEnvVariable(EnvVariable.SMTP_USER);
const mailPass = getEnvVariable(EnvVariable.SMTP_PASS);
const mailFrom = getEnvVariable(EnvVariable.FROM_EMAIL);

const transporter = nodemailer.createTransport({
  host: mailHost,
  port: parseInt(mailPort),
  auth: {
    user: mailUser,
    pass: mailPass,
  },
});


export const sendEmail = async (options: SendMailOptions) => {
  return transporter.sendMail({
    from: mailFrom,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
}

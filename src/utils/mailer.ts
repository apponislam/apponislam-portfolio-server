// utils/mailer.ts
import nodemailer from "nodemailer";
import config from "../config";

const transporter = nodemailer.createTransport({
    host: config.mail.smtp_host,
    port: Number(config.mail.smtp_port),
    secure: Number(config.mail.smtp_port) === 465,
    auth: {
        user: config.mail.smtp_user,
        pass: config.mail.smtp_pass,
    },
});

const sendMail = async (options: any = {}) => {
    const { to, subject, html, text, from } = options;

    try {
        const info = await transporter.sendMail({
            from: from || `"Appon Islam" <${config.mail.smtp_user}>`,
            to,
            subject: subject || "Notification from Appon Islam",
            html,
            text,
        });

        console.log(`✅ Email sent successfully: ${info.messageId} to ${to}`);
        return true;
    } catch (err) {
        console.error("❌ Failed to send email:", err);
        return false;
    }
};

export default sendMail;

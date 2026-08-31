"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAdminPasswordResetEmail = exports.sendEmailUpdateVerification = exports.sendSupportReplyEmail = exports.sendAdminResetNotificationEmail = exports.sendPasswordResetEmail = exports.sendEmailChangeVerification = exports.sendWelcomeEmail = exports.sendOtpEmail = exports.sendVerificationEmail = exports.sendContactAdminReplyEmail = exports.sendContactAutoReplyEmail = exports.sendContactNotificationEmail = exports.sendMail = void 0;
const resend_1 = require("./resend");
const config_1 = __importDefault(require("../app/config"));
const contactEmailTemplates_1 = require("./contactEmailTemplates");
const sendMail = (to, subject, html, from) => {
    (0, resend_1.sendEmailWithResend)({ to, subject, html, from }).catch((error) => {
        console.error("Resend Email error:", error);
    });
};
exports.sendMail = sendMail;
const sendContactNotificationEmail = (to, data) => {
    const html = (0, contactEmailTemplates_1.renderContactEmailHtml)(data);
    (0, exports.sendMail)(to, `New Message: ${data.name} via Appon Islam Portfolio`, html);
};
exports.sendContactNotificationEmail = sendContactNotificationEmail;
const sendContactAutoReplyEmail = (to, data) => {
    const html = (0, contactEmailTemplates_1.renderAutoReplyEmailHtml)(data);
    (0, exports.sendMail)(to, "Thanks for reaching out! - Appon Islam", html);
};
exports.sendContactAutoReplyEmail = sendContactAutoReplyEmail;
const sendContactAdminReplyEmail = (to, data) => {
    const html = (0, contactEmailTemplates_1.renderAdminReplyEmailHtml)(data);
    (0, exports.sendMail)(to, "Response to your inquiry - Appon Islam", html);
};
exports.sendContactAdminReplyEmail = sendContactAdminReplyEmail;
/**
 * Clean & Modern Base Email Layout
 * Styled with Appon Islam's signature Emerald (#10b981) & Dark (#090d16) palette
 */
const renderBaseLayout = ({ preheader = "Notification from Appon Islam", title, bodyHtml }) => {
    const currentYear = new Date().getFullYear();
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="margin: 0; padding: 40px 10px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
    <div style="display: none; font-size: 1px; color: #f8fafc; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        ${preheader}
    </div>

    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
        <tbody>
            <!-- Header Bar -->
            <tr>
                <td style="padding: 24px 28px; background-color: #090d16; border-bottom: 3px solid #10b981;">
                    <table border="0" cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td style="vertical-align: middle; padding-right: 12px;">
                                    <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #10b981;"></div>
                                </td>
                                <td style="vertical-align: middle;">
                                    <span style="font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: 1px;">APPON <span style="color: #10b981;">ISLAM</span></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>

            <!-- Content Area -->
            <tr>
                <td style="padding: 32px 28px;">
                    ${bodyHtml}
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="background-color: #f8fafc; padding: 20px 28px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
                    <p style="margin: 0 0 6px 0;">
                        Official Communication from <a href="https://www.apponislam.com" style="color: #0f172a; font-weight: 600; text-decoration: none;">apponislam.com</a>
                    </p>
                    <p style="margin: 0;">
                        &copy; ${currentYear} Appon Islam. All rights reserved.
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>
    `.trim();
};
const formatClientUrl = (url) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }
    const baseUrl = config_1.default.client_url ? config_1.default.client_url.replace(/\/$/, "") : "https://www.apponislam.com";
    return `${baseUrl}/${url.replace(/^\//, "")}`;
};
const sendVerificationEmail = (email, name, verificationUrl, otp) => {
    const title = "Verify Your Email Address";
    const fullUrl = formatClientUrl(verificationUrl);
    const bodyHtml = `
        <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 12px; font-size: 20px; font-weight: 700;">Hello ${name},</h2>
        <p style="margin-bottom: 24px; color: #475569; line-height: 1.6;">Thank you for registering on <strong>Appon Islam Portfolio</strong>. Please verify your email address to complete your account setup.</p>
        
        <div style="text-align: center; margin: 32px 0;">
            <a href="${fullUrl}" target="_blank" style="background-color: #10b981; color: #ffffff; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 8px; display: inline-block;">
                Verify Email Address
            </a>
        </div>

        ${otp
        ? `
        <div style="background-color: #ecfdf5; border: 1px dashed #6ee7b7; border-radius: 8px; padding: 20px; text-align: center; margin: 28px 0;">
            <p style="margin: 0 0 8px 0; color: #065f46; font-size: 13px; font-weight: 600; text-transform: uppercase;">Or Enter 6-Digit Code</p>
            <div style="font-size: 32px; font-weight: 800; color: #047857; letter-spacing: 6px;">${otp}</div>
            <p style="margin: 8px 0 0 0; color: #059669; font-size: 12px;">Expires in 10 minutes</p>
        </div>
        `
        : ""}

        <p style="margin-top: 24px; font-size: 13px; color: #64748b;">
            If the button doesn't work, copy and paste this URL into your browser:<br>
            <a href="${fullUrl}" style="color: #10b981; word-break: break-all;">${fullUrl}</a>
        </p>
    `;
    const html = renderBaseLayout({ preheader: "Verify your email address", title, bodyHtml });
    (0, exports.sendMail)(email, title, html);
};
exports.sendVerificationEmail = sendVerificationEmail;
const sendOtpEmail = (email, name, otp, purpose = "Authentication") => {
    const title = `Your Verification Code for ${purpose}`;
    const bodyHtml = `
        <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 12px; font-size: 20px; font-weight: 700;">Hello ${name},</h2>
        <p style="margin-bottom: 20px; color: #475569;">Use the 6-digit OTP code below to verify your request on <strong>Appon Islam Portfolio</strong>:</p>

        <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
            <div style="font-size: 36px; font-weight: 800; color: #047857; letter-spacing: 8px;">${otp}</div>
            <p style="margin: 10px 0 0 0; color: #059669; font-size: 13px; font-weight: 500;">Valid for 10 minutes</p>
        </div>
    `;
    const html = renderBaseLayout({ preheader: `Your OTP verification code is ${otp}`, title, bodyHtml });
    (0, exports.sendMail)(email, title, html);
};
exports.sendOtpEmail = sendOtpEmail;
const sendWelcomeEmail = (email, name) => {
    const title = "Welcome to Appon Islam Portfolio!";
    const bodyHtml = `
        <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 12px; font-size: 20px; font-weight: 700;">Welcome, ${name}!</h2>
        <p style="margin-bottom: 16px; color: #475569;">Thank you for connecting with <strong>Appon Islam Portfolio</strong>.</p>
        <p style="margin-bottom: 24px; color: #475569;">Feel free to explore my full-stack projects, developer stack, and available software engineering services.</p>

        <div style="text-align: center; margin: 32px 0;">
            <a href="${config_1.default.client_url || "https://www.apponislam.com"}" target="_blank" style="background-color: #10b981; color: #ffffff; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 8px; display: inline-block;">
                Visit Portfolio Website
            </a>
        </div>
    `;
    const html = renderBaseLayout({ preheader: `Welcome to Appon Islam Portfolio!`, title, bodyHtml });
    (0, exports.sendMail)(email, title, html);
};
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendEmailChangeVerification = (email, name, verificationUrl) => {
    const title = "Confirm Your New Email Address";
    const fullUrl = formatClientUrl(verificationUrl);
    const bodyHtml = `
        <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 12px; font-size: 20px; font-weight: 700;">Hello ${name},</h2>
        <p style="margin-bottom: 24px; color: #475569;">You recently requested to update your email address on <strong>Appon Islam Portfolio</strong>. Please confirm this change below:</p>

        <div style="text-align: center; margin: 32px 0;">
            <a href="${fullUrl}" target="_blank" style="background-color: #10b981; color: #ffffff; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 8px; display: inline-block;">
                Confirm New Email
            </a>
        </div>
    `;
    const html = renderBaseLayout({ preheader: "Confirm your new email address", title, bodyHtml });
    (0, exports.sendMail)(email, title, html);
};
exports.sendEmailChangeVerification = sendEmailChangeVerification;
const sendPasswordResetEmail = (email, name, otp, resetUrl) => {
    const title = "Reset Your Password";
    const fullUrl = formatClientUrl(resetUrl);
    const bodyHtml = `
        <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 12px; font-size: 20px; font-weight: 700;">Hello ${name},</h2>
        <p style="margin-bottom: 20px; color: #475569;">We received a request to reset your password. Use the 6-digit OTP code below or click the reset button:</p>

        <div style="background-color: #fef2f2; border: 1px dashed #fca5a5; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
            <p style="margin: 0 0 6px 0; color: #991b1b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Password Reset OTP Code</p>
            <div style="font-size: 32px; font-weight: 800; color: #b91c1c; letter-spacing: 6px;">${otp}</div>
            <p style="margin: 6px 0 0 0; color: #dc2626; font-size: 12px;">Valid for 15 minutes</p>
        </div>

        <div style="text-align: center; margin: 28px 0;">
            <a href="${fullUrl}" target="_blank" style="background-color: #ef4444; color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 8px; display: inline-block;">
                Reset Password
            </a>
        </div>
    `;
    const html = renderBaseLayout({ preheader: "Password reset request", title, bodyHtml });
    (0, exports.sendMail)(email, title, html);
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const sendAdminResetNotificationEmail = (email, name, temporaryPass) => {
    const title = "Your Password Has Been Reset by Admin";
    const bodyHtml = `
        <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 12px; font-size: 20px; font-weight: 700;">Hello ${name},</h2>
        <p style="margin-bottom: 20px; color: #475569;">Your account password on <strong>Appon Islam Portfolio</strong> has been updated by an administrator.</p>

        <div style="background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
            <p style="margin: 0 0 6px 0; color: #475569; font-size: 12px; font-weight: 600; text-transform: uppercase;">Temporary Password</p>
            <div style="font-size: 24px; font-weight: 800; color: #0f172a; font-family: monospace;">${temporaryPass}</div>
        </div>
    `;
    const html = renderBaseLayout({ preheader: "Password updated by admin", title, bodyHtml });
    (0, exports.sendMail)(email, title, html);
};
exports.sendAdminResetNotificationEmail = sendAdminResetNotificationEmail;
const sendSupportReplyEmail = (email, name, subject, originalMessage, replyMessage) => {
    const title = `Re: ${subject}`;
    const bodyHtml = `
        <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 12px; font-size: 20px; font-weight: 700;">Hello ${name},</h2>
        <p style="margin-bottom: 16px; color: #475569;">Thank you for contacting <strong>Appon Islam</strong> regarding: <strong>"${subject}"</strong>.</p>

        <div style="background-color: #f8fafc; border-left: 4px solid #10b981; border: 1px solid #e2e8f0; border-left-width: 4px; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h4 style="margin: 0 0 10px 0; color: #047857; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Response:</h4>
            <div style="color: #0f172a; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${replyMessage}</div>
        </div>
    `;
    const html = renderBaseLayout({ preheader: `Response regarding "${subject}"`, title, bodyHtml });
    (0, exports.sendMail)(email, title, html);
};
exports.sendSupportReplyEmail = sendSupportReplyEmail;
exports.sendEmailUpdateVerification = exports.sendEmailChangeVerification;
exports.sendAdminPasswordResetEmail = exports.sendAdminResetNotificationEmail;

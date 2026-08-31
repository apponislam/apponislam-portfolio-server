import { sendEmailWithResend } from "./resend";
import config from "../app/config";

import {
    renderContactEmailHtml,
    renderAutoReplyEmailHtml,
    renderAdminReplyEmailHtml,
    ContactEmailProps,
    AutoReplyEmailProps,
    AdminReplyEmailProps,
} from "./contactEmailTemplates";

/**
 * Dispatch mail via RESEND
 */
export const sendMail = (to: string | string[], subject: string, html: string, from?: string) => {
    sendEmailWithResend({ to, subject, html, from }).catch((error) => {
        console.error("Resend Email error:", error);
    });
};

export const sendContactNotificationEmail = (to: string | string[], data: ContactEmailProps) => {
    const html = renderContactEmailHtml(data);
    sendMail(to, `New Contact Message from ${data.name}`, html);
};

export const sendContactAutoReplyEmail = (to: string, data: AutoReplyEmailProps) => {
    const html = renderAutoReplyEmailHtml(data);
    sendMail(to, "Thanks for reaching out! - Appon Islam", html);
};

export const sendContactAdminReplyEmail = (to: string, data: AdminReplyEmailProps) => {
    const html = renderAdminReplyEmailHtml(data);
    sendMail(to, "Response to your inquiry - Appon Islam", html);
};

/**
 * Core HTML Email Wrapper Template
 * Designed for maximum email client compatibility
 * matching Appon Islam's signature Emerald (#10b981) & Dark (#090d16) design language.
 */
const renderBaseLayout = ({ preheader = "Notification from Appon Islam Portfolio", title, bodyHtml, footerText = "This is an automated email from Appon Islam Portfolio. Please do not reply directly." }: { preheader?: string; title: string; bodyHtml: string; footerText?: string }) => {
    const currentYear = new Date().getFullYear();

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <!-- Hidden Preheader -->
    <div style="display: none; font-size: 1px; color: #f8fafc; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        ${preheader}
    </div>

    <!-- Outer Container -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 40px 15px;">
        <tr>
            <td align="center">
                <!-- Email Card Container -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.04);">
                    
                    <!-- Header Bar -->
                    <tr>
                        <td style="background-color: #090d16; padding: 24px 32px; text-align: center; border-bottom: 3px solid #10b981;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
                                <tr>
                                    <td style="vertical-align: middle;">
                                        <img src="https://i.ibb.co.com/g3gCBzP/apclassroom.jpg" alt="Appon Islam Logo" width="36" height="36" style="display: block; width: 36px; height: 36px; border-radius: 50%; border: 2px solid #10b981; object-fit: cover;" />
                                    </td>
                                    <td style="padding-left: 12px; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: 1px; font-family: 'Segoe UI', sans-serif; vertical-align: middle;">
                                        APPON <span style="color: #10b981;">ISLAM</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Main Content Body -->
                    <tr>
                        <td style="padding: 36px 32px 30px 32px; color: #334155; font-size: 15px; line-height: 1.6;">
                            ${bodyHtml}
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 32px;">
                            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 0;">
                        </td>
                    </tr>

                    <!-- Footer Area -->
                    <tr>
                        <td style="padding: 24px 32px 32px 32px; text-align: center; background-color: #ffffff;">
                            <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; font-weight: 500;">
                                ${footerText}
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                                &copy; ${currentYear} Appon Islam. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};

const formatClientUrl = (url: string): string => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }
    const baseUrl = config.client_url ? config.client_url.replace(/\/$/, "") : "https://www.apponislam.com";
    return `${baseUrl}/${url.replace(/^\//, "")}`;
};

/**
 * 1. Email Verification Template
 */
export const sendVerificationEmail = (email: string, name: string, verificationUrl: string, otp?: string) => {
    const title = "Verify Your Email Address";
    const fullUrl = formatClientUrl(verificationUrl);
    const bodyHtml = `
        <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 12px; font-size: 20px; font-weight: 700;">Hello ${name},</h2>
        <p style="margin-bottom: 24px; color: #475569;">Thank you for registering on <strong>Appon Islam Portfolio</strong>. Please verify your email address to continue.</p>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0;">
            <a href="${fullUrl}" target="_blank" style="background-color: #10b981; color: #ffffff; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                Verify Email Address
            </a>
        </div>

        ${
            otp
                ? `
        <!-- OTP Code Box -->
        <div style="background-color: #ecfdf5; border: 1px dashed #6ee7b7; border-radius: 10px; padding: 20px; text-align: center; margin: 28px 0;">
            <p style="margin: 0 0 8px 0; color: #065f46; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Or Enter 6-Digit Code In App</p>
            <div style="font-size: 32px; font-weight: 800; color: #047857; letter-spacing: 6px;">${otp}</div>
            <p style="margin: 8px 0 0 0; color: #059669; font-size: 12px;">This code expires in 10 minutes.</p>
        </div>
        `
                : ""
        }

        <p style="margin-top: 24px; font-size: 13px; color: #64748b;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${fullUrl}" style="color: #10b981; word-break: break-all;">${fullUrl}</a>
        </p>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">This verification link expires in 24 hours.</p>
    `;

    const html = renderBaseLayout({ preheader: "Verify your email address", title, bodyHtml });
    sendMail(email, title, html);
};

/**
 * 2. General OTP Code Email Template
 */
export const sendOtpEmail = (email: string, name: string, otp: string, purpose: string = "Authentication") => {
    const title = `Your Verification Code for ${purpose}`;
    const bodyHtml = `
        <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 12px; font-size: 20px; font-weight: 700;">Hello ${name},</h2>
        <p style="margin-bottom: 20px; color: #475569;">Use the 6-digit OTP code below to complete your request for <strong>Appon Islam Portfolio</strong>:</p>

        <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 24px; text-align: center; margin: 28px 0;">
            <div style="font-size: 36px; font-weight: 800; color: #047857; letter-spacing: 8px;">${otp}</div>
            <p style="margin: 10px 0 0 0; color: #059669; font-size: 13px; font-weight: 500;">Valid for 10 minutes</p>
        </div>

        <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
            If you did not request this code, please ignore this email.
        </p>
    `;

    const html = renderBaseLayout({ preheader: `Your ${purpose} verification code is ${otp}`, title, bodyHtml });
    sendMail(email, title, html);
};

/**
 * 3. Welcome Email Template
 */
export const sendWelcomeEmail = (email: string, name: string) => {
    const title = "Welcome to Appon Islam Portfolio!";
    const bodyHtml = `
        <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 12px; font-size: 20px; font-weight: 700;">Welcome, ${name}!</h2>
        <p style="margin-bottom: 16px; color: #475569;">Thank you for reaching out or creating an account on <strong>Appon Islam Portfolio</strong>.</p>
        
        <p style="margin-bottom: 24px; color: #475569;">Feel free to explore featured projects, tech stacks, and services.</p>

        <div style="text-align: center; margin: 32px 0;">
            <a href="${config.client_url || "https://www.apponislam.com"}" target="_blank" style="background-color: #10b981; color: #ffffff; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 10px; display: inline-block;">
                Visit Portfolio Website
            </a>
        </div>
    `;

    const html = renderBaseLayout({ preheader: `Welcome to Appon Islam Portfolio, ${name}!`, title, bodyHtml });
    sendMail(email, title, html);
};

/**
 * 4. Email Change Confirmation Template
 */
export const sendEmailChangeVerification = (email: string, name: string, verificationUrl: string) => {
    const title = "Confirm Your New Email Address";
    const fullUrl = formatClientUrl(verificationUrl);
    const bodyHtml = `
        <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 12px; font-size: 20px; font-weight: 700;">Hello ${name},</h2>
        <p style="margin-bottom: 24px; color: #475569;">You recently requested to update your registered email address on <strong>Appon Islam Portfolio</strong>. Please confirm this change by clicking below:</p>

        <div style="text-align: center; margin: 32px 0;">
            <a href="${fullUrl}" target="_blank" style="background-color: #10b981; color: #ffffff; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 10px; display: inline-block;">
                Confirm New Email
            </a>
        </div>

        <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">This link expires in 24 hours.</p>
    `;

    const html = renderBaseLayout({ preheader: "Confirm your new email address", title, bodyHtml });
    sendMail(email, title, html);
};

/**
 * 5. Password Reset Request Email Template
 */
export const sendPasswordResetEmail = (email: string, name: string, otp: string, resetUrl: string) => {
    const title = "Reset Your Password";
    const fullUrl = formatClientUrl(resetUrl);
    const bodyHtml = `
        <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 12px; font-size: 20px; font-weight: 700;">Hello ${name},</h2>
        <p style="margin-bottom: 20px; color: #475569;">We received a request to reset your password. Use the 6-digit OTP code below or click the reset button:</p>

        <div style="background-color: #fef2f2; border: 1px dashed #fca5a5; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0;">
            <p style="margin: 0 0 6px 0; color: #991b1b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Your Password Reset OTP Code</p>
            <div style="font-size: 32px; font-weight: 800; color: #b91c1c; letter-spacing: 6px;">${otp}</div>
            <p style="margin: 6px 0 0 0; color: #dc2626; font-size: 12px;">Valid for 15 minutes</p>
        </div>

        <div style="text-align: center; margin: 28px 0;">
            <a href="${fullUrl}" target="_blank" style="background-color: #ef4444; color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 8px; display: inline-block;">
                Reset Password Online
            </a>
        </div>
    `;

    const html = renderBaseLayout({ preheader: "Password reset request for your account", title, bodyHtml });
    sendMail(email, title, html);
};

/**
 * 6. Admin Reset Password Notification Template
 */
export const sendAdminResetNotificationEmail = (email: string, name: string, temporaryPass: string) => {
    const title = "Your Password Has Been Reset by Admin";
    const bodyHtml = `
        <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 12px; font-size: 20px; font-weight: 700;">Hello ${name},</h2>
        <p style="margin-bottom: 20px; color: #475569;">Your account password on <strong>Appon Islam Portfolio</strong> has been reset by an administrator.</p>

        <div style="background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0;">
            <p style="margin: 0 0 6px 0; color: #475569; font-size: 12px; font-weight: 600; text-transform: uppercase;">Temporary Password</p>
            <div style="font-size: 24px; font-weight: 800; color: #0f172a; font-family: monospace;">${temporaryPass}</div>
        </div>

        <p style="font-size: 13px; color: #64748b;">Please log in and update your password immediately from your profile settings.</p>
    `;

    const html = renderBaseLayout({ preheader: "Your account password was updated by admin", title, bodyHtml });
    sendMail(email, title, html);
};

// Aliases for exact naming compatibility
export const sendEmailUpdateVerification = sendEmailChangeVerification;
export const sendAdminPasswordResetEmail = sendAdminResetNotificationEmail;

/**
 * 7. Support Contact Reply Email Template
 */
export const sendSupportReplyEmail = (email: string, name: string, subject: string, originalMessage: string, replyMessage: string) => {
    const title = `Re: ${subject}`;
    const bodyHtml = `
        <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 12px; font-size: 20px; font-weight: 700;">Hello ${name},</h2>
        <p style="margin-bottom: 16px; color: #475569;">Thank you for contacting <strong>Appon Islam Support</strong> regarding: <strong>"${subject}"</strong>.</p>

        <div style="background-color: #f8fafc; border-left: 4px solid #10b981; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h4 style="margin: 0 0 10px 0; color: #047857; font-weight: 700; font-size: 15px;">Appon Islam Response:</h4>
            <div style="color: #1e293b; font-size: 15px; line-height: 1.6;">
                ${replyMessage.replace(/\n/g, "<br/>")}
            </div>
        </div>
    `;

    const html = renderBaseLayout({ preheader: `Response regarding "${subject}"`, title, bodyHtml });
    sendMail(email, title, html);
};

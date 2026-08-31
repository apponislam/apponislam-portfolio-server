export interface ContactEmailProps {
    name: string;
    email: string;
    message: string;
    social?: string;
    replyUrl?: string;
}

export interface AutoReplyEmailProps {
    name: string;
}

export interface AdminReplyEmailProps {
    recipientName: string;
    replyMessage: string;
    originalMessage?: string;
}

/**
 * 1. Contact Form Submission Admin Notification Email HTML Template
 */
export const renderContactEmailHtml = ({ name, email, message, social, replyUrl }: ContactEmailProps): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Message</title>
</head>
<body style="margin: 0; padding: 40px 10px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
        <tbody>
            <!-- Header -->
            <tr>
                <td style="padding: 32px 28px 24px 28px; border-bottom: 1px solid #e2e8f0;">
                    <table border="0" cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td style="vertical-align: middle; padding-right: 8px;">
                                    <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #10b981;"></div>
                                </td>
                                <td style="vertical-align: middle;">
                                    <span style="font-size: 12px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">New Message Received</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h1 style="margin: 10px 0 0 0; font-size: 22px; font-weight: 700; color: #0f172a;">Appon Islam Portfolio</h1>
                </td>
            </tr>

            <!-- Content Body -->
            <tr>
                <td style="padding: 28px;">
                    <!-- Sender Details Box -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; font-size: 14px;">
                        <tbody>
                            <tr>
                                <td style="padding: 4px 0; color: #64748b; width: 80px; font-weight: 500;">From:</td>
                                <td style="padding: 4px 0; color: #0f172a; font-weight: 600;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Email:</td>
                                <td style="padding: 4px 0;">
                                    <a href="mailto:${email}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${email}</a>
                                </td>
                            </tr>
                            ${
                                social
                                    ? `
                            <tr>
                                <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Link:</td>
                                <td style="padding: 4px 0;">
                                    <a href="${social}" target="_blank" rel="noreferrer" style="color: #0284c7; text-decoration: none;">${social}</a>
                                </td>
                            </tr>
                            `
                                    : ""
                            }
                        </tbody>
                    </table>

                    <!-- Message Body -->
                    <div style="margin-bottom: 28px;">
                        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px 20px; font-size: 15px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${message}</div>
                    </div>

                    <!-- Reply Button -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tbody>
                            <tr>
                                <td align="center" style="padding-top: 8px;">
                                    <a href="${replyUrl || `mailto:${email}`}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; text-decoration: none;">
                                        Reply to ${name}
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="background-color: #f8fafc; padding: 18px 28px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
                    <p style="margin: 0;">
                        Received via <a href="https://www.apponislam.com" style="color: #0f172a; font-weight: 600; text-decoration: none;">apponislam.com</a>
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>
    `.trim();
};

/**
 * 2. Contact Auto Reply Confirmation Email HTML Template
 */
export const renderAutoReplyEmailHtml = ({ name }: AutoReplyEmailProps): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Message Received</title>
</head>
<body style="margin: 0; padding: 40px 10px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
        <tbody>
            <!-- Header -->
            <tr>
                <td style="padding: 32px 28px 24px 28px; border-bottom: 1px solid #e2e8f0; text-align: center;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td style="vertical-align: middle; padding-right: 8px;">
                                    <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #10b981;"></div>
                                </td>
                                <td style="vertical-align: middle;">
                                    <span style="font-size: 12px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">Message Received</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h1 style="margin: 10px 0 0 0; font-size: 24px; font-weight: 700; color: #0f172a;">Thanks for reaching out!</h1>
                </td>
            </tr>

            <!-- Content Body -->
            <tr>
                <td style="padding: 32px 28px;">
                    <p style="font-size: 16px; font-weight: 600; color: #0f172a; margin-top: 0;">Hi ${name},</p>
                    <p style="font-size: 15px; line-height: 1.6; color: #334155;">
                        Thank you for connecting with me through my portfolio. I’ve received your message and will review it promptly.
                    </p>
                    <p style="font-size: 15px; line-height: 1.6; color: #334155;">
                        I usually respond within 24 hours.
                    </p>

                    <!-- Sign-off & Social Links Table -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                        <tbody>
                            <tr>
                                <td style="vertical-align: middle;">
                                    <p style="margin: 0; font-size: 14px; font-weight: 700; color: #0f172a;">Appon Islam</p>
                                    <p style="margin: 2px 0 0 0; font-size: 13px; color: #64748b;">Full Stack Developer & Software Engineer</p>
                                </td>
                                <td align="right" style="vertical-align: middle;">
                                    <table border="0" cellpadding="0" cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <td style="padding-left: 8px;">
                                                    <a href="https://www.linkedin.com/in/apponislam/" target="_blank" rel="noreferrer" style="display: inline-block; width: 36px; height: 36px; border-radius: 50%; background-color: #0077b5; text-align: center; line-height: 36px; text-decoration: none;">
                                                        <img src="https://img.icons8.com/ios-filled/50/ffffff/linkedin.png" alt="LinkedIn" width="18" height="18" style="vertical-align: middle; border: 0;" />
                                                    </a>
                                                </td>
                                                <td style="padding-left: 8px;">
                                                    <a href="https://wa.me/8801722779803" target="_blank" rel="noreferrer" style="display: inline-block; width: 36px; height: 36px; border-radius: 50%; background-color: #25d366; text-align: center; line-height: 36px; text-decoration: none;">
                                                        <img src="https://img.icons8.com/ios-filled/50/ffffff/whatsapp.png" alt="WhatsApp" width="18" height="18" style="vertical-align: middle; border: 0;" />
                                                    </a>
                                                </td>
                                                <td style="padding-left: 8px;">
                                                    <a href="https://www.facebook.com/appon19/" target="_blank" rel="noreferrer" style="display: inline-block; width: 36px; height: 36px; border-radius: 50%; background-color: #1877f2; text-align: center; line-height: 36px; text-decoration: none;">
                                                        <img src="https://img.icons8.com/ios-filled/50/ffffff/facebook-new.png" alt="Facebook" width="18" height="18" style="vertical-align: middle; border: 0;" />
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="background-color: #f8fafc; padding: 18px 28px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
                    <p style="margin: 0;">
                        © ${new Date().getFullYear()} Appon Islam • <a href="https://www.apponislam.com" style="color: #0f172a; font-weight: 600; text-decoration: none;">apponislam.com</a>
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>
    `.trim();
};

/**
 * 3. Admin Custom Reply Email HTML Template
 */
export const renderAdminReplyEmailHtml = ({ recipientName, replyMessage, originalMessage }: AdminReplyEmailProps): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reply to your inquiry</title>
</head>
<body style="margin: 0; padding: 40px 10px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
        <tbody>
            <!-- Header -->
            <tr>
                <td style="padding: 32px 28px 24px 28px; border-bottom: 1px solid #e2e8f0;">
                    <table border="0" cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td style="vertical-align: middle; padding-right: 8px;">
                                    <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #10b981;"></div>
                                </td>
                                <td style="vertical-align: middle;">
                                    <span style="font-size: 12px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">Response from Appon Islam</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h1 style="margin: 10px 0 0 0; font-size: 22px; font-weight: 700; color: #0f172a;">Reply to your inquiry</h1>
                </td>
            </tr>

            <!-- Content Body -->
            <tr>
                <td style="padding: 32px 28px;">
                    <p style="font-size: 16px; font-weight: 600; color: #0f172a; margin-top: 0;">Hi ${recipientName},</p>

                    <!-- Admin's Reply Content -->
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #10b981; border-radius: 8px; padding: 20px; font-size: 15px; line-height: 1.6; color: #0f172a; white-space: pre-wrap; margin: 20px 0 24px 0;">${replyMessage}</div>

                    <!-- Original Message Quote -->
                    ${
                        originalMessage
                            ? `
                    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Your Original Message</p>
                        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; font-size: 13px; line-height: 1.5; color: #64748b; font-style: italic; white-space: pre-wrap;">"${originalMessage}"</div>
                    </div>
                    `
                            : ""
                    }

                    <!-- Sign-off & Social Links Table -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                        <tbody>
                            <tr>
                                <td style="vertical-align: middle;">
                                    <p style="margin: 0; font-size: 14px; font-weight: 700; color: #0f172a;">Appon Islam</p>
                                    <p style="margin: 2px 0 0 0; font-size: 13px; color: #64748b;">Full Stack Developer & Software Engineer</p>
                                </td>
                                <td align="right" style="vertical-align: middle;">
                                    <table border="0" cellpadding="0" cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <td style="padding-left: 8px;">
                                                    <a href="https://www.linkedin.com/in/apponislam/" target="_blank" rel="noreferrer" style="display: inline-block; width: 36px; height: 36px; border-radius: 50%; background-color: #0077b5; text-align: center; line-height: 36px; text-decoration: none;">
                                                        <img src="https://img.icons8.com/ios-filled/50/ffffff/linkedin.png" alt="LinkedIn" width="18" height="18" style="vertical-align: middle; border: 0;" />
                                                    </a>
                                                </td>
                                                <td style="padding-left: 8px;">
                                                    <a href="https://wa.me/8801722779803" target="_blank" rel="noreferrer" style="display: inline-block; width: 36px; height: 36px; border-radius: 50%; background-color: #25d366; text-align: center; line-height: 36px; text-decoration: none;">
                                                        <img src="https://img.icons8.com/ios-filled/50/ffffff/whatsapp.png" alt="WhatsApp" width="18" height="18" style="vertical-align: middle; border: 0;" />
                                                    </a>
                                                </td>
                                                <td style="padding-left: 8px;">
                                                    <a href="https://www.facebook.com/appon19/" target="_blank" rel="noreferrer" style="display: inline-block; width: 36px; height: 36px; border-radius: 50%; background-color: #1877f2; text-align: center; line-height: 36px; text-decoration: none;">
                                                        <img src="https://img.icons8.com/ios-filled/50/ffffff/facebook-new.png" alt="Facebook" width="18" height="18" style="vertical-align: middle; border: 0;" />
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="background-color: #f8fafc; padding: 18px 28px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
                    <p style="margin: 0;">
                        Sent from <a href="https://www.apponislam.com" style="color: #0f172a; font-weight: 600; text-decoration: none;">apponislam.com</a>
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>
    `.trim();
};

// utils/emailTemplates.ts
export const adminNotificationEmailTemplate = (name: string, email: string, message: string, social?: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New Contact Message</title>
<style>
    body {
        font-family: 'Arial', sans-serif;
        background-color: #f9f9f9;
        color: #333;
        margin: 0;
        padding: 0;
    }
    .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    }
    h1 {
        color: #1a73e8;
    }
    p {
        line-height: 1.6;
    }
    .details {
        background: #f1f1f1;
        padding: 15px;
        border-radius: 5px;
        margin: 15px 0;
    }
    .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #999;
        text-align: center;
    }
</style>
</head>
<body>
<div class="container">
    <h1>New Contact Message Received</h1>
    <p>You have a new message from your website contact form:</p>
    <div class="details">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><strong>Social:</strong> ${social || "N/A"}</p>
    </div>
    <p>Check your admin dashboard for more details.</p>
    <p>Best regards,<br/>Appon Islam Team</p>
</div>
<div class="footer">
    &copy; ${new Date().getFullYear()} Appon Islam. All rights reserved.
</div>
</body>
</html>
`;

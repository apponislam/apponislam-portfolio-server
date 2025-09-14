// export const thankYouEmailTemplate = (name: string) => `
// <!DOCTYPE html>
// <html lang="en">
// <head>
// <meta charset="UTF-8" />
// <meta name="viewport" content="width=device-width, initial-scale=1.0" />
// <title>Thank You! From Appon Islam</title>
// <style>
//     body {
//         font-family: 'Arial', sans-serif;
//         background-color: #f9f9f9;
//         color: #333;
//         margin: 0;
//         padding: 0;
//     }
//     .container {
//         max-width: 600px;
//         margin: 40px auto;
//         background-color: #ffffff;
//         padding: 30px;
//         border-radius: 10px;
//         box-shadow: 0 2px 12px rgba(0,0,0,0.1);
//     }
//     h1 {
//         color: #1a73e8;
//     }
//     p {
//         line-height: 1.6;
//     }
//     .social-icons a {
//         display: inline-block;
//         margin-right: 10px;
//         text-decoration: none;
//         color: #1a73e8;
//         font-weight: bold;
//     }
//     .footer {
//         margin-top: 30px;
//         font-size: 12px;
//         color: #999;
//         text-align: center;
//     }
// </style>
// </head>
// <body>
// <div class="container">
//     <h1>Hi ${name},</h1>
//     <p>Thank you for reaching out! We really appreciate your message and will get back to you shortly.</p>
//     <p>Meanwhile, you can connect with us on social media:</p>
//     <div class="social-icons">
//         <a href="https://twitter.com/appon2003" target="_blank">Twitter</a>
//         <a href="https://linkedin.com/in/apponislam" target="_blank">LinkedIn</a>
//         <a href="https://github.com/apponislam" target="_blank">GitHub</a>
//     </div>
//     <p>Best regards,<br/>The Appon Islam Team</p>
// </div>
// <div class="footer">
//     &copy; ${new Date().getFullYear()} Appon Islam. All rights reserved.
// </div>
// </body>
// </html>
// `;

export const thankYouEmailTemplate = (name: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Thank You for Contacting Us</title>
<style>
    body {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f6f8;
        color: #333;
    }
    .email-container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    h1 {
        color: #1a73e8;
        font-size: 24px;
        margin-bottom: 10px;
    }
    p {
        font-size: 16px;
        line-height: 1.6;
        margin: 10px 0;
    }
    .social-buttons {
        margin: 20px 0;
    }
    .social-buttons a {
        display: inline-block;
        text-decoration: none;
        color: #fff;
        background-color: #1a73e8;
        padding: 10px 15px;
        margin-right: 10px;
        border-radius: 6px;
        font-weight: bold;
        font-size: 14px;
        transition: background 0.3s;
    }
    .social-buttons a:hover {
        background-color: #1666c1;
    }
    .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #888;
        text-align: center;
    }
</style>
</head>
<body>
<div class="email-container">
    <h1>Hello ${name},</h1>
    <p>Thank you for reaching out! We really appreciate your message and will get back to you shortly.</p>
    <p>Meanwhile, connect with us on social media:</p>
    <div class="social-buttons">
        <a href="https://twitter.com/your_handle" target="_blank">Twitter</a>
        <a href="https://linkedin.com/in/your_handle" target="_blank">LinkedIn</a>
        <a href="https://github.com/your_handle" target="_blank">GitHub</a>
    </div>
    <p>Best regards,<br>The Appon Islam Team</p>
</div>
<div class="footer">
    &copy; ${new Date().getFullYear()} Appon Islam. All rights reserved.
</div>
</body>
</html>
`;

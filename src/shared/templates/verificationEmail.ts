export const generateVerificationEmailTemplate = (name: string, verificationUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Verify Your Email</title>
<style>
  body { font-family: Arial, sans-serif; background-color: #f5f6fa; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 50px auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
  h1 { color: #333; }
  p { color: #555; line-height: 1.5; }
  a.button { display: inline-block; padding: 12px 25px; margin-top: 20px; font-size: 16px; color: #fff; background-color: #4f46e5; text-decoration: none; border-radius: 6px; }
  a.button:hover { background-color: #4338ca; }
</style>
</head>
<body>
  <div class="container">
    <h1>Hello ${name},</h1>
    <p>Thank you for registering! Please verify your email by clicking the button below:</p>
    <a href="${verificationUrl}" class="button">Verify Email</a>
    <p>If you did not create an account, please ignore this email.</p>
    <p>Cheers,<br/>The Appon Islam Team</p>
  </div>
</body>
</html>
`;

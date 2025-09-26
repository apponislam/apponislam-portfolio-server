"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtpEmailTemplate = void 0;
const generateOtpEmailTemplate = (name, otp) => {
    return `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; padding: 40px; color: #51545e;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden;">
            <tr>
              <td style="padding: 30px; text-align: center; background-color: #4CAF50; color: #ffffff;">
                <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px;">
                <p style="font-size: 16px; margin-bottom: 20px;">Hello <strong>${name}</strong>,</p>
                <p style="font-size: 16px; margin-bottom: 30px;">
                  We received a request to reset your password. Enter the OTP below to proceed:
                </p>
                <div style="font-size: 32px; font-weight: bold; color: #4CAF50; text-align: center; margin-bottom: 30px; letter-spacing: 4px;">
                  ${otp}
                </div>
                <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">
                  This OTP is valid for <strong>10 minutes</strong>. If you did not request this password reset, you can safely ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                  © ${new Date().getFullYear()} Appon Islam. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
};
exports.generateOtpEmailTemplate = generateOtpEmailTemplate;

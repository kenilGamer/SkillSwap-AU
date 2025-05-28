import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';

const TEST_ACCOUNT_FILE = path.join(process.cwd(), '.ethereal-account.json');

// Load or create test account for development
async function getTestAccount() {
  try {
    // Try to load existing test account
    const data = await fs.readFile(TEST_ACCOUNT_FILE, 'utf-8');
    const account = JSON.parse(data);
    console.log('Loaded existing Ethereal test account');
    return account;
  } catch (error) {
    // Create new test account if none exists
    try {
      const testAccount = await nodemailer.createTestAccount();
      // Save the account details
      await fs.writeFile(
        TEST_ACCOUNT_FILE,
        JSON.stringify(testAccount, null, 2)
      );
      console.log('Created new Ethereal test account:', {
        user: testAccount.user,
        pass: testAccount.pass,
        smtp: testAccount.smtp,
      });
      return testAccount;
    } catch (error) {
      console.error('Error creating test account:', error);
      throw error;
    }
  }
}

// Create transporter based on environment
async function createTransporter() {
  if (process.env.NODE_ENV === 'production') {
    // Production SMTP configuration
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('Production SMTP configuration is incomplete');
    }
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Development: Use Ethereal Email
    const testAccount = await getTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Log the test account details for easy access
    console.log('\n=== Ethereal Email Test Account ===');
    console.log('Email:', testAccount.user);
    console.log('Password:', testAccount.pass);
    console.log('SMTP Host:', testAccount.smtp.host);
    console.log('SMTP Port:', testAccount.smtp.port);
    console.log('Preview URL:', `https://ethereal.email/login?email=${encodeURIComponent(testAccount.user)}`);
    console.log('================================\n');

    return transporter;
  }
}

// Create and verify transporter
let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (!transporter) {
    transporter = await createTransporter();
    // Verify transporter configuration
    await transporter.verify();
    console.log('SMTP Server is ready to send emails');
  }
  return transporter;
}

export async function sendVerificationEmail(email: string, verificationUrl: string) {
  const transporter = await getTransporter();
  
  const mailOptions = {
    from: `"SkillSwap" <${process.env.SMTP_FROM || 'noreply@skillswap.com'}>`,
    to: email,
    subject: 'Verify your SkillSwap account',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your SkillSwap account</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #4169E1; margin: 0; font-size: 24px;">SkillSwap</h1>
              <p style="color: #666; margin: 10px 0 0;">Connect with Developers</p>
            </div>

            <!-- Main Content -->
            <div style="background: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Welcome to SkillSwap!</h2>
              <p>Thank you for creating an account. To get started, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background-color: #4169E1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
                  Verify Email Address
                </a>
              </div>

              <p style="margin-bottom: 20px;">If the button doesn't work, you can also copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #f5f5f5; padding: 15px; border-radius: 4px; font-size: 14px; color: #666;">
                ${verificationUrl}
              </p>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 14px; margin: 0;">
                  This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} SkillSwap. All rights reserved.
              </p>
              <p style="color: #999; font-size: 12px; margin: 5px 0 0;">
                This is an automated message, please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    console.log('Attempting to send verification email to:', email);
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully:', {
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
    });
    return info;
  } catch (error) {
    console.error('Error sending verification email:', {
      error,
      to: email,
      from: mailOptions.from,
    });
    throw new Error('Failed to send verification email');
  }
} 
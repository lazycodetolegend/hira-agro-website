const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text, replyTo }) => {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    // If EMAIL_PASS is not configured in environment, log clearly
    if (!emailUser || !emailPass || emailPass.trim() === '') {
      console.log('\n================ [EMAIL NOTIFICATION LOG] ================');
      console.log(`📩 To: ${to}`);
      console.log(`📌 Subject: ${subject}`);
      console.log(`📄 Message:\n${text || html}`);
      console.log('----------------------------------------------------------');
      console.log('⚠️ [PRODUCTION ALERT]: Real email was NOT dispatched.');
      console.log('👉 Reason: EMAIL_PASS is missing in environment variables.');
      console.log('👉 For Render / Cloud Host: Add EMAIL_USER, EMAIL_PASS, and COMPANY_EMAIL in your Cloud Dashboard Environment Variables.');
      console.log('===========================================================\n');
      return false;
    }

    const transportConfig = (process.env.EMAIL_SERVICE && process.env.EMAIL_SERVICE.toLowerCase() === 'gmail')
      ? {
          service: 'gmail',
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        }
      : {
          host: process.env.EMAIL_HOST || 'smtp.gmail.com',
          port: Number(process.env.EMAIL_PORT) || 465,
          secure: process.env.EMAIL_SECURE === 'true' || (!process.env.EMAIL_PORT && !process.env.EMAIL_SERVICE),
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        };

    const transporter = nodemailer.createTransport(transportConfig);

    const mailOptions = {
      from: `"Hira Agro Industry" <${emailUser}>`,
      to,
      subject,
      text,
      html: html || (text ? text.replace(/\n/g, '<br/>') : undefined),
    };

    if (replyTo) {
      mailOptions.replyTo = replyTo;
    }

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email delivered to ${to} (${info.messageId})`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending real email via SMTP to ${to}:`, error.message);
    return false;
  }
};

module.exports = sendEmail;

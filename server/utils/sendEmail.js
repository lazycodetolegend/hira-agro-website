const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    // If EMAIL_PASS is not configured in .env, simulate and log in terminal
    if (!emailUser || !emailPass || emailPass.trim() === '') {
      console.log('\n================ [EMAIL NOTIFICATION LOG] ================');
      console.log(`📩 To: ${to}`);
      console.log(`📌 Subject: ${subject}`);
      console.log(`📄 Message:\n${text || html}`);
      console.log('----------------------------------------------------------');
      console.log('💡 NOTE: Real email was NOT sent to inbox because EMAIL_PASS is empty in server/.env.');
      console.log('👉 To receive real emails in your Gmail inbox:');
      console.log('   1. Go to Google Account > Security > 2-Step Verification > App Passwords');
      console.log('   2. Generate a 16-character App Password for "Mail"');
      console.log('   3. Set EMAIL_PASS=your_16_digit_app_password in server/.env');
      console.log('===========================================================\n');
      return true;
    }

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const info = await transporter.sendMail({
      from: `"Hira Agro Industry" <${emailUser}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('✅ Real email dispatched successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending real email via SMTP:', error.message);
    return false;
  }
};

module.exports = sendEmail;

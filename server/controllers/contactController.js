const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

// POST /api/contact - Public Inquiry & Bulk Quote Submission
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Save to MongoDB with status 'new'
    const contact = await Contact.create({ name, email, phone, message, status: 'new', isRead: false });

    // Customer confirmation email
    const customerSubject = 'Thank you for your Inquiry — Hira Agro Industry';
    const customerText = `Hello ${name},\n\nThank you for reaching out to Hira Agro Industry!\n\nWe have received your bulk order request / inquiry:\n"${message}"\n\nOur team will review your requirement and get back to you within 24 hours.\n\nBest regards,\nHira Agro Industry\nJamshet, Ashagad, Dahanu, Palghar\nMob: +91 79776 97797 / +91 98239 58410`;
    const customerHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background: #064e3b; color: #ffffff; padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; color: #f8fafc; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #d1fae5; text-transform: uppercase; letter-spacing: 1.5px; }
    .content { padding: 32px 24px; color: #1e293b; line-height: 1.6; }
    .content h2 { margin-top: 0; font-size: 18px; color: #064e3b; }
    .quote-box { background: #f8fafc; border-left: 4px solid #d97706; padding: 14px 18px; margin: 20px 0; border-radius: 0 6px 6px 0; }
    .quote-box p { margin: 0; font-size: 14px; color: #334155; font-style: italic; }
    .footer { background: #0f172a; color: #94a3b8; padding: 24px; text-align: center; font-size: 12px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>HIRA AGRO INDUSTRY</h1>
      <p>Premium Rice Millers & Grain Processors</p>
    </div>
    <div class="content">
      <h2>Inquiry Confirmation</h2>
      <p>Dear <strong>${name}</strong>,</p>
      <p>Thank you for reaching out to Hira Agro Industry. We have received your wholesale inquiry and our sales team is reviewing your requirement.</p>
      
      <div class="quote-box">
        <strong style="color: #0f172a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Your Requirement:</strong>
        <p>"${message.replace(/\n/g, '<br/>')}"</p>
      </div>

      <p>One of our sales representatives will contact you within <strong>24 business hours</strong> with current wholesale milling rates, available packaging, and freight schedules.</p>

      <p>For urgent requirements, please feel free to call our mill office directly:</p>
      <p style="margin: 4px 0;">📞 <strong>+91 79776 97797</strong> / <strong>+91 98239 58410</strong></p>
      <p style="margin: 4px 0;">✉️ <strong>hiraagroindustry51@gmail.com</strong></p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px 0; color: #ffffff; font-weight: 600;">Hira Agro Industry</p>
      <p style="margin: 0 0 6px 0;">Jamshet, Vasantwadi, Ashagad, Tal. Dahanu, Dist. Palghar — 401602, Maharashtra</p>
      <p style="margin: 0;">GSTIN: 27BSHPM4686A1ZM</p>
    </div>
  </div>
</body>
</html>`;

    // Mill Owner notification email (ALWAYS sent so mill owner never misses a lead)
    const companyEmail = process.env.COMPANY_EMAIL || 'hiraagroindustry51@gmail.com';
    const ownerSubject = `🚨 New Bulk Inquiry / Contact from ${name}`;
    const ownerText = `New inquiry received from website:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nRequirement / Message:\n${message}\n\nReceived at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
    const ownerHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background: #b45309; color: #ffffff; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; }
    .header p { margin: 4px 0 0; font-size: 13px; color: #fef3c7; }
    .content { padding: 30px 24px; color: #1e293b; line-height: 1.6; }
    .badge { display: inline-block; background: #ecfdf5; color: #065f46; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 4px; border: 1px solid #a7f3d0; margin-bottom: 16px; }
    .table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px; }
    .table td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
    .table td.label { font-weight: 600; color: #475569; width: 35%; background: #f8fafc; }
    .message-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 16px; margin: 16px 0; font-size: 14px; color: #1e293b; }
    .actions { text-align: center; margin-top: 24px; }
    .btn { display: inline-block; background: #064e3b; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚨 NEW WEBSITE INQUIRY</h1>
      <p>Hira Agro Industry Lead Notification</p>
    </div>
    <div class="content">
      <div class="badge">LEAD RECEIVED</div>
      <table class="table">
        <tr>
          <td class="label">Customer Name</td>
          <td><strong>${name}</strong></td>
        </tr>
        <tr>
          <td class="label">Email Address</td>
          <td><a href="mailto:${email}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${email}</a></td>
        </tr>
        <tr>
          <td class="label">Phone Number</td>
          <td><a href="tel:${phone || ''}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${phone || 'Not provided'}</a></td>
        </tr>
        <tr>
          <td class="label">Submission Time</td>
          <td>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
        </tr>
      </table>

      <strong style="color: #0f172a; font-size: 14px;">Requirement / Message:</strong>
      <div class="message-box">
        "${message.replace(/\n/g, '<br/>')}"
      </div>

      <div class="actions">
        <a href="mailto:${email}?subject=RE: Wholesale Inquiry — Hira Agro Industry" class="btn">Reply via Email</a>
        ${phone ? `<a href="tel:${phone}" class="btn" style="background: #d97706;">Call Customer</a>` : ''}
      </div>
    </div>
  </div>
</body>
</html>`;

    // Await both emails so cloud runtime doesn't terminate before SMTP socket finishes
    const [customerResult, ownerResult] = await Promise.allSettled([
      sendEmail({
        to: email,
        subject: customerSubject,
        text: customerText,
        html: customerHtml,
      }),
      sendEmail({
        to: companyEmail,
        replyTo: email,
        subject: ownerSubject,
        text: ownerText,
        html: ownerHtml,
      }),
    ]);

    const customerSent = customerResult.status === 'fulfilled' && customerResult.value === true;
    const ownerSent = ownerResult.status === 'fulfilled' && ownerResult.value === true;
    console.log(`Email dispatch status: Customer (${email}): ${customerSent ? 'SENT' : 'FAILED'}, Owner (${companyEmail}): ${ownerSent ? 'SENT' : 'FAILED'}`);

    res.status(201).json({
      message: customerSent
        ? 'Thank you for reaching out! Your inquiry has been sent to our sales team and a confirmation email was delivered to your inbox.'
        : 'Thank you for reaching out! Your inquiry has been sent to our sales team and we will get back to you shortly.',
      emailDelivered: customerSent,
      contact: {
        _id: contact._id,
        name: contact.name,
        email: contact.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// GET /api/contact - Admin only
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    const unreadCount = await Contact.countDocuments({ $or: [{ isRead: false }, { status: 'new' }] });
    res.status(200).json({ contacts, count: contacts.length, unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// GET /api/contact/unread/count - Admin/Manager
const getUnreadCount = async (req, res) => {
  try {
    const count = await Contact.countDocuments({ $or: [{ isRead: false }, { status: 'new' }] });
    res.status(200).json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// PUT /api/contact/:id/status - Admin only (Sends email to customer when status is 'responded')
const updateStatus = async (req, res) => {
  try {
    const { status, replyMessage } = req.body;
    const isRead = status === 'read' || status === 'responded' ? true : false;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, isRead },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // If status is updated to 'responded', send notification email to customer!
    if (status === 'responded') {
      const responseSubject = 'Update on your Inquiry — Hira Agro Industry';
      const responseText = replyMessage 
        ? `Hello ${contact.name},\n\nRegarding your inquiry:\n"${contact.message}"\n\nOur team response:\n${replyMessage}\n\nBest regards,\nHira Agro Industry\nJamshet, Ashagad, Dahanu, Palghar — 401602\nMob: +91 79776 97797 / +91 98239 58410`
        : `Hello ${contact.name},\n\nThank you for contacting Hira Agro Industry.\n\nOur management team has reviewed your inquiry:\n"${contact.message}"\n\nYour request has been marked as RESPONDED & PROCESSED. Our representative will contact you directly via call or email.\n\nIf you have any further questions or immediate bulk purchase orders, feel free to call our sales office at +91 79776 97797 / +91 98239 58410 or reply directly to this email.\n\nWarm regards,\nHira Agro Industry\nJamshet, Ashagad, Dahanu, Palghar — 401602\nGSTIN: 27BSHPM4686A1ZM`;

      await sendEmail({
        to: contact.email,
        subject: responseSubject,
        text: responseText
      }).catch(err => {
        console.error('Mark responded email error:', err.message);
      });
    }

    res.status(200).json({ 
      contact, 
      message: status === 'responded' 
        ? `Inquiry marked as responded and notification email dispatched to ${contact.email}!` 
        : `Status updated to ${status}` 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// PUT /api/contact/:id/read - Admin only
const markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true, status: 'read' },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({ contact });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// DELETE /api/contact/:id - Admin only
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { submitContact, getContacts, getUnreadCount, updateStatus, markAsRead, deleteContact };

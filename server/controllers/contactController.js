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

    // Send confirmation email to Customer (non-blocking async)
    const customerSubject = 'Thank you for your Inquiry — Hira Agro Industry';
    const customerText = `Hello ${name},\n\nThank you for reaching out to Hira Agro Industry!\n\nWe have received your bulk order request / inquiry:\n"${message}"\n\nOur team will review your requirement and get back to you within 24 hours.\n\nBest regards,\nHira Agro Industry\nJamshet, Ashagad, Dahanu, Palghar\nMob: +91 79776 97797 / +91 98239 58410`;

    sendEmail({ to: email, subject: customerSubject, text: customerText }).catch(err => {
      console.error('Customer confirmation email error:', err.message);
    });

    // Send notification email to Company Owner if email is different
    const companyEmail = process.env.COMPANY_EMAIL || 'hiraagroindustry51@gmail.com';
    if (companyEmail.toLowerCase() !== email.toLowerCase()) {
      const companySubject = `🚨 New Bulk Inquiry / Contact from ${name}`;
      const companyText = `New inquiry received from website:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nRequirement / Message:\n${message}\n\nReceived at: ${new Date().toLocaleString()}`;

      sendEmail({ to: companyEmail, subject: companySubject, text: companyText }).catch(err => {
        console.error('Owner notification email error:', err.message);
      });
    }

    res.status(201).json({
      message: 'Thank you for reaching out! Your inquiry has been sent to our sales team and a confirmation email was delivered to your inbox.',
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

      sendEmail({
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

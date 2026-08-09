const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, username, id_name, password } = req.body;
    const rawIdentifier = String(email || username || id_name || '').trim();

    if (!rawIdentifier || !password) {
      return res.status(400).json({ message: 'Please provide Staff ID / Email and password' });
    }

    const cleanIdentifier = rawIdentifier.toLowerCase();

    // Regex match to handle case-insensitive match for username or email
    const user = await User.findOne({
      $or: [
        { email: cleanIdentifier },
        { username: cleanIdentifier },
        { email: { $regex: new RegExp(`^${cleanIdentifier}$`, 'i') } },
        { username: { $regex: new RegExp(`^${cleanIdentifier}$`, 'i') } }
      ]
    }).populate('companyId').select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid Staff ID / Email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Staff ID / Email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, companyId: user.companyId ? user.companyId._id : null },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        companyId: user.companyId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('companyId');
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/register (Admin only)
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    if (role === 'admin') {
      return res.status(403).json({ message: 'Cannot create admin accounts' });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email: cleanEmail,
      password,
      role: 'manager',
      companyId: req.companyId
    });

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email, id_name } = req.body;
    const identifier = String(email || id_name || '').toLowerCase().trim();

    if (!identifier) {
      return res.status(400).json({ message: 'Please provide your ID or Email address' });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'No account found with this ID or Email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    user.resetPasswordToken = otp;
    user.resetPasswordExpires = expires;
    await user.save();

    const targetEmail = user.email || identifier;

    // Send email
    const subject = 'Password Reset OTP — Hira Agro Industry';
    const text = `Hello ${user.name},\n\nYou requested a password reset for your staff account at Hira Agro Industry.\n\nYour 6-digit OTP code is: ${otp}\n\nThis code will expire in 15 minutes.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nHira Agro Industry`;

    sendEmail({
      to: targetEmail,
      subject,
      text
    });

    const hasRealSmtp = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

    const message = hasRealSmtp
      ? `Password reset OTP has been sent to ${targetEmail}. Check your email inbox!`
      : `Reset OTP generated: ${otp} (Demo Mode — Enter code ${otp} to reset password)`;

    res.status(200).json({
      message,
      email: targetEmail,
      otp: hasRealSmtp ? undefined : otp
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({
      email: cleanEmail,
      resetPasswordToken: String(otp).trim(),
      resetPasswordExpires: { $gt: Date.now() }
    }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP code. Please request a new code.' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful! You can now log in with your new password.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/users (Admin only)
const getUsers = async (req, res) => {
  try {
    let query = { role: 'manager' };
    if (req.companyId) {
      query.companyId = req.companyId;
    }
    const users = await User.find(query).select('-password');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/auth/users/:id (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin accounts' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
  getMe,
  register,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser
};

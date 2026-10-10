const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Fail closed. This repository is public, so a default signing key such as
// 'secret123' would let anyone forge an admin token.
function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured — refusing to verify tokens');
  }
  return secret;
}

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret());
    req.user = await User.findById(decoded.id).select('-password').populate('companyId');
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // Determine companyId for data scoping
    if (req.user.role === 'super_admin') {
      // Super admin can operate on any company via x-company-id header
      const headerCompanyId = req.headers['x-company-id'];
      req.companyId = headerCompanyId || null;
    } else {
      // Regular admin/manager — scoped to their own company
      req.companyId = req.user.companyId?._id || req.user.companyId || null;
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    // super_admin can access all admin and manager routes
    if (req.user.role === 'super_admin') {
      return next();
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
    }
    next();
  }
};

module.exports = { protect, authorize, auth: protect, jwtSecret };

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  login,
  getMe,
  register,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser
} = require('../controllers/authController');

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/me', protect, getMe);
router.post('/register', protect, authorize('admin'), register);
router.get('/users', protect, authorize('admin'), getUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { submitContact, getContacts, getUnreadCount, updateStatus, markAsRead, deleteContact } = require('../controllers/contactController');

router.route('/')
  .post(submitContact)
  .get(protect, authorize('admin'), getContacts);

router.route('/unread/count')
  .get(protect, authorize('admin', 'manager'), getUnreadCount);

router.route('/:id/status')
  .put(protect, authorize('admin'), updateStatus);

router.route('/:id/read')
  .put(protect, authorize('admin'), markAsRead);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteContact);

module.exports = router;

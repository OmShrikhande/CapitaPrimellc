const express = require('express');
const {
  createCheckoutSession,
  getCheckoutSession,
} = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');
const { listStripeActivity } = require('../controllers/paymentAdminController');

const router = express.Router();

router.post('/checkout-session', createCheckoutSession);
router.get('/checkout-session/:sessionId', getCheckoutSession);
/** Mirror of GET /api/admin/stripe-activity (same auth) for environments where admin routes lag deploy. */
router.get('/admin/stripe-activity', authenticateToken, listStripeActivity);

module.exports = router;

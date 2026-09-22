const express = require('express');
const router = express.Router();
const { simulatePayment } = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/simulate', authenticate, simulatePayment);

module.exports = router;

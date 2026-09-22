const express = require('express');
const router = express.Router();
const { validateCoupon, getCoupons } = require('../controllers/coupon.controller');

router.get('/', getCoupons);
router.post('/validate', validateCoupon);

module.exports = router;

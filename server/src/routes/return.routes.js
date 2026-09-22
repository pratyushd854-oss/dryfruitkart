const express = require('express');
const router = express.Router();
const {
  createReturnRequest,
  getMyReturns,
} = require('../controllers/return.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/', authenticate, createReturnRequest);
router.get('/my-returns', authenticate, getMyReturns);

module.exports = router;

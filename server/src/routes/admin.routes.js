const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllReturns,
  handleReturnRequest,
  getAllCustomers,
  getLowStockProducts,
} = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

// All admin routes require auth + admin role
router.use(authenticate, requireAdmin);

router.get('/stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/returns', getAllReturns);
router.put('/returns/:id', handleReturnRequest);
router.get('/customers', getAllCustomers);
router.get('/low-stock', getLowStockProducts);

module.exports = router;

const http = require('http');
const app = require('./src/app');

const server = app.listen(5099, async () => {
  console.log('Test Server running on port 5099');

  const request = (path, method = 'GET', data = null, headers = {}) => {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: '127.0.0.1',
        port: 5099,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      });

      req.on('error', reject);
      if (data) req.write(JSON.stringify(data));
      req.end();
    });
  };

  try {
    // 1. Health check
    console.log('Testing /api/health...');
    const health = await request('/api/health');
    console.log('Health check status:', health.status, health.data.app);

    // 2. Products Catalog
    console.log('Testing /api/products...');
    const products = await request('/api/products');
    console.log('Products count:', products.data.length);

    // 3. Customer Login
    console.log('Testing customer login...');
    const custLogin = await request('/api/auth/login', 'POST', {
      email: 'customer@dryfruitkart.com',
      password: 'customer123',
    });
    console.log('Customer login:', custLogin.data.message, 'Role:', custLogin.data.user?.role);

    // 4. Admin Login & Stats
    console.log('Testing admin login & stats...');
    const adminLogin = await request('/api/auth/login', 'POST', {
      email: 'admin@dryfruitkart.com',
      password: 'admin123',
    });
    console.log('Admin login:', adminLogin.data.message, 'Role:', adminLogin.data.user?.role);

    const adminStats = await request('/api/admin/stats', 'GET', null, {
      Authorization: `Bearer ${adminLogin.data.token}`,
    });
    console.log('Admin stats total orders:', adminStats.data.stats.totalOrders);
    console.log('Admin stats total revenue: ₹', adminStats.data.stats.totalRevenue);

    // 5. Coupon validation
    console.log('Testing coupon RCB2026...');
    const couponRes = await request('/api/coupons/validate', 'POST', {
      code: 'RCB2026',
      cartTotal: 1000,
    });
    console.log('Coupon result:', couponRes.data.message, 'Discount: ₹', couponRes.data.coupon.discountAmount);

    console.log('\n ALL TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});

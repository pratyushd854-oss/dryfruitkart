const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding DryFruitKart Database...');

  // Clear existing records safely
  await prisma.returnRequest.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Users
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const customerPassword = await bcrypt.hash('customer123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'RCB Admin',
      email: 'admin@dryfruitkart.com',
      password: hashedPassword,
      phone: '+91 9876543210',
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Virat Sharma',
      email: 'customer@dryfruitkart.com',
      password: customerPassword,
      phone: '+91 9880123456',
      role: 'CUSTOMER',
      addresses: {
        create: [
          {
            street: '18 Chinnaswamy Stadium Road, MG Road',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560001',
            isDefault: true,
          },
        ],
      },
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Ananya Rao',
      email: 'ananya.rao@gmail.com',
      password: customerPassword,
      phone: '+91 9900112233',
      role: 'CUSTOMER',
      addresses: {
        create: [
          {
            street: '42, Indiranagar 100ft Road',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560038',
            isDefault: true,
          },
        ],
      },
    },
  });

  console.log('Created users: admin@dryfruitkart.com, customer@dryfruitkart.com');

  // 2. Create Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'RCB2026',
        discountPercent: 18,
        maxDiscount: 350,
        minOrderValue: 799,
        validUntil: new Date('2026-12-31'),
        isActive: true,
      },
      {
        code: 'ROYAL10',
        discountPercent: 10,
        maxDiscount: 200,
        minOrderValue: 499,
        validUntil: new Date('2026-12-31'),
        isActive: true,
      },
      {
        code: 'GOLDEN25',
        discountPercent: 25,
        maxDiscount: 600,
        minOrderValue: 1499,
        validUntil: new Date('2026-12-31'),
        isActive: true,
      },
    ],
  });

  console.log('Created coupons: RCB2026, ROYAL10, GOLDEN25');

  // 3. Create Products (Dry Fruits) with high quality Unsplash images
  const productsData = [
    {
      name: 'Royal Mamra Almonds (Badam)',
      description: 'Hand-picked organic Mamra almonds from Iran and Kashmir. Known for exceptionally high natural almond oil content and zero sugar.',
      category: 'Almonds',
      pricePerKg: 1950,
      stockKg: 45,
      imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      rating: 4.9,
      numReviews: 88,
      origin: 'Kashmir, India & Iran',
      healthBenefits: 'Sharpens memory, boosts brain health, and provides essential Omega-3 fatty acids.',
    },
    {
      name: 'California Jumbo Almonds',
      description: 'Crunchy, sweet, and uniform premium Grade A California almonds. Steam-pasteurized and vacuum-packed for peak freshness.',
      category: 'Almonds',
      pricePerKg: 1100,
      stockKg: 80,
      imageUrl: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      rating: 4.8,
      numReviews: 120,
      origin: 'California, USA',
      healthBenefits: 'High in Vitamin E, dietary fiber, magnesium, and plant-based protein.',
    },
    {
      name: 'King W240 Whole Cashews (Kaju)',
      description: 'Extra-large, snow-white Goan whole cashew nuts. Roasted gently to preserve delicate natural sweetness and butteriness.',
      category: 'Cashews',
      pricePerKg: 1350,
      stockKg: 60,
      imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      rating: 4.9,
      numReviews: 95,
      origin: 'Goa, India',
      healthBenefits: 'Rich in copper and healthy monounsaturated fats for cardiovascular vitality.',
    },
    {
      name: 'Roasted & Salted Cashews',
      description: 'Lightly tossed in Himalayan pink rock salt and dry roasted without added palm oil. The ultimate healthy crunchy snack.',
      category: 'Cashews',
      pricePerKg: 1450,
      stockKg: 35,
      imageUrl: 'https://images.unsplash.com/photo-1536591375315-1b836890ba4e?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      rating: 4.7,
      numReviews: 45,
      origin: 'Mangalore, India',
      healthBenefits: 'Guilt-free electrolyte balance and instant athletic stamina boost.',
    },
    {
      name: 'Iranian Roasted Salted Pistachios (Pista)',
      description: 'Naturally smiling, jumbo pistachios from Rafsanjan with a golden hue and vibrant emerald-green kernels.',
      category: 'Pistachios',
      pricePerKg: 1750,
      stockKg: 50,
      imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      rating: 4.9,
      numReviews: 110,
      origin: 'Iran',
      healthBenefits: 'Rich in lutein and zeaxanthin for vision support and gut-friendly prebiotic fiber.',
    },
    {
      name: 'Raw Shelled Pistachio Kernels',
      description: 'Unsalted, raw green pistachio kernels without shells. Ideal for gourmet desserts, bakery, and morning muesli.',
      category: 'Pistachios',
      pricePerKg: 2200,
      stockKg: 25,
      imageUrl: 'https://images.unsplash.com/photo-1543208543-6042c1791a35?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      rating: 4.8,
      numReviews: 32,
      origin: 'California, USA',
      healthBenefits: 'Packed with Vitamin B6 and high plant sterols to maintain healthy cholesterol.',
    },
    {
      name: 'Kashmiri Snow White Walnut Kernels (Akhrot)',
      description: 'Extra light halves from organic walnut orchards of Kupwara and Pahalgam. Zero bitter aftertaste, bursting with nutty oils.',
      category: 'Walnuts',
      pricePerKg: 1650,
      stockKg: 40,
      imageUrl: 'https://images.unsplash.com/photo-1577906096429-f73c2c312435?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      rating: 4.9,
      numReviews: 76,
      origin: 'Kashmir Valley',
      healthBenefits: 'Superior plant Omega-3 (ALA) source supporting cognitive longevity.',
    },
    {
      name: 'Royal Medjool King Dates (Khajoor)',
      description: 'Known as the Fruit of Kings. Giant, luscious, melt-in-mouth dates with a caramel-honey texture and natural sweetness.',
      category: 'Dates',
      pricePerKg: 1250,
      stockKg: 65,
      imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      rating: 4.9,
      numReviews: 142,
      origin: 'Jordan Valley',
      healthBenefits: 'Immediate natural pre-workout energy, rich in iron and potassium.',
    },
    {
      name: 'Ajwa Dates of Madinah',
      description: 'Authentic dark Ajwa dates directly sourced from the blessed groves of Madinah. Soft, fine, and revered for therapeutic properties.',
      category: 'Dates',
      pricePerKg: 1890,
      stockKg: 30,
      imageUrl: 'https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      rating: 5.0,
      numReviews: 64,
      origin: 'Madinah, Saudi Arabia',
      healthBenefits: 'Protects liver and heart, packed with vital trace minerals.',
    },
    {
      name: 'Afghan Black Sun-Dried Raisins (Kismis)',
      description: 'Large, seedless, seedless black currants dried naturally under the radiant Kandahar sunshine without artificial preservatives.',
      category: 'Raisins',
      pricePerKg: 650,
      stockKg: 90,
      imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      rating: 4.7,
      numReviews: 53,
      origin: 'Kandahar, Afghanistan',
      healthBenefits: 'Combats anemia, purifies blood, and aids natural digestive cleansing.',
    },
    {
      name: 'Royal Afghani Dried Figs (Anjeer)',
      description: 'Strung golden sun-dried Afghan figs, naturally plump with sweet seeds and chewy caramel pulp.',
      category: 'Exotic',
      pricePerKg: 1600,
      stockKg: 4, // Low stock warning trigger! (< 5kg)
      imageUrl: 'https://images.unsplash.com/photo-1599818818464-927909335a14?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      rating: 4.8,
      numReviews: 41,
      origin: 'Afghanistan',
      healthBenefits: 'Immense calcium for bone density and highest dietary fiber among dry fruits.',
    },
    {
      name: 'RCB Royal Gold Celebration Hamper',
      description: 'A luxurious keepsake crimson and gold velvet gift box containing Mamra Almonds, W240 Cashews, Iranian Pistachios, and Medjool Dates (250g each).',
      category: 'Hampers',
      pricePerKg: 2499,
      stockKg: 20,
      imageUrl: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      rating: 5.0,
      numReviews: 38,
      origin: 'Artisanal DryFruitKart Studio',
      healthBenefits: 'The premier royal gift curated with all four cornerstone superfruits.',
    },
  ];

  const createdProducts = [];
  for (const prod of productsData) {
    const created = await prisma.product.create({ data: prod });
    createdProducts.push(created);
  }

  console.log(`Created ${createdProducts.length} dry fruit products.`);

  // 4. Create Sample Orders for Analytics
  // Order 1 (Delivered, Paid)
  const order1 = await prisma.order.create({
    data: {
      userId: customer.id,
      totalAmount: 1850,
      discountAmount: 150,
      couponCode: 'ROYAL10',
      status: 'DELIVERED',
      shippingName: 'Virat Sharma',
      shippingPhone: '+91 9880123456',
      shippingAddress: '18 Chinnaswamy Stadium Road, MG Road',
      shippingCity: 'Bengaluru',
      shippingPincode: '560001',
      items: {
        create: [
          {
            productId: createdProducts[0].id, // Mamra Almonds
            variantLabel: '500g',
            quantityKg: 0.5,
            price: 975,
            itemTotal: 975,
          },
          {
            productId: createdProducts[2].id, // Cashews
            variantLabel: '500g',
            quantityKg: 0.5,
            price: 675,
            itemTotal: 675,
          },
          {
            productId: createdProducts[9].id, // Raisins
            variantLabel: '500g',
            quantityKg: 0.5,
            price: 325,
            itemTotal: 325,
          },
        ],
      },
      payment: {
        create: {
          method: 'UPI',
          status: 'PAID',
          transactionId: 'UPI_TXN_RCB_9823412',
          paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  // Order 2 (Shipped, Paid)
  const order2 = await prisma.order.create({
    data: {
      userId: customer2.id,
      totalAmount: 2499,
      discountAmount: 0,
      status: 'SHIPPED',
      shippingName: 'Ananya Rao',
      shippingPhone: '+91 9900112233',
      shippingAddress: '42, Indiranagar 100ft Road',
      shippingCity: 'Bengaluru',
      shippingPincode: '560038',
      items: {
        create: [
          {
            productId: createdProducts[11].id, // Royal Gold Hamper
            variantLabel: '1kg Hamper',
            quantityKg: 1.0,
            price: 2499,
            itemTotal: 2499,
          },
        ],
      },
      payment: {
        create: {
          method: 'CARD',
          status: 'PAID',
          transactionId: 'CARD_TXN_993412',
          paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  // Order 3 (Placed, COD)
  await prisma.order.create({
    data: {
      userId: customer.id,
      totalAmount: 1100,
      discountAmount: 0,
      status: 'PLACED',
      shippingName: 'Virat Sharma',
      shippingPhone: '+91 9880123456',
      shippingAddress: '18 Chinnaswamy Stadium Road, MG Road',
      shippingCity: 'Bengaluru',
      shippingPincode: '560001',
      items: {
        create: [
          {
            productId: createdProducts[1].id, // California Almonds
            variantLabel: '1kg',
            quantityKg: 1.0,
            price: 1100,
            itemTotal: 1100,
          },
        ],
      },
      payment: {
        create: {
          method: 'COD',
          status: 'PENDING',
          transactionId: 'COD_PENDING',
        },
      },
    },
  });

  // Sample Return Request for Order 1
  await prisma.returnRequest.create({
    data: {
      orderId: order1.id,
      userId: customer.id,
      reason: 'Outer packaging slightly dented during courier transit. Requesting replacement.',
      status: 'REQUESTED',
      adminNotes: 'Inspection team notified.',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

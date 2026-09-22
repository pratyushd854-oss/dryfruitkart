const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProducts = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, isFeatured, sort } = req.query;

    let where = {};

    if (category && category !== 'All') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ];
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (minPrice || maxPrice) {
      where.pricePerKg = {};
      if (minPrice) where.pricePerKg.gte = parseFloat(minPrice);
      if (maxPrice) where.pricePerKg.lte = parseFloat(maxPrice);
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { pricePerKg: 'asc' };
    if (sort === 'price_desc') orderBy = { pricePerKg: 'desc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };
    if (sort === 'name_asc') orderBy = { name: 'asc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    const categoryList = categories.map((c) => c.category);
    res.json(categoryList);
  } catch (error) {
    next(error);
  }
};

// Admin handlers
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      pricePerKg,
      stockKg,
      imageUrl,
      isFeatured,
      origin,
      healthBenefits,
    } = req.body;

    if (!name || !pricePerKg || !category) {
      return res.status(400).json({ message: 'Name, category, and pricePerKg are required.' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        category,
        pricePerKg: parseFloat(pricePerKg),
        stockKg: stockKg ? parseFloat(stockKg) : 20.0,
        imageUrl:
          imageUrl ||
          'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80',
        isFeatured: Boolean(isFeatured),
        origin: origin || 'Premium Harvest',
        healthBenefits: healthBenefits || 'Natural dry fruit packed with essential nutrients.',
      },
    });

    res.status(201).json({ message: 'Product created successfully.', product });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category,
      pricePerKg,
      stockKg,
      imageUrl,
      isFeatured,
      origin,
      healthBenefits,
    } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        category: category || undefined,
        pricePerKg: pricePerKg !== undefined ? parseFloat(pricePerKg) : undefined,
        stockKg: stockKg !== undefined ? parseFloat(stockKg) : undefined,
        imageUrl: imageUrl || undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        origin: origin || undefined,
        healthBenefits: healthBenefits || undefined,
      },
    });

    res.json({ message: 'Product updated successfully.', product: updated });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};

const Product = require('../models/product');
const Contact = require('../models/contact');

// Get all products with optional category filter
exports.getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    const categories = await Product.distinct('category');
    const contactInfo = await Contact.findOrCreate();
    
    res.render('pages/products', {
      title: 'Products',
      products,
      categories,
      currentCategory: category || 'all',
      contactInfo
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('pages/error', {
      title: 'Error',
      error: 'Error loading products'
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const contactInfo = await Contact.findOrCreate();
    
    if (!product) {
      return res.status(404).render('pages/error', {
        title: 'Error',
        error: 'Product not found'
      });
    }
    
    res.render('pages/product-detail', {
      title: product.name,
      product,
      contactInfo
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('pages/error', {
      title: 'Error',
      error: 'Error loading product details'
    });
  }
};
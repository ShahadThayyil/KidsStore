const Product = require('../models/product');
const Contact = require('../models/contact');

exports.getHomepage = async (req, res) => {
  try {
    // Get featured products
    const featuredProducts = await Product.find({ featured: true }).sort({ createdAt: -1 });
    
    // Get contact information for WhatsApp button
    const contactInfo = await Contact.findOrCreate();
    
    res.render('pages/index', {
      title: 'Kids Store - Home',
      featuredProducts,
      contactInfo
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('pages/error', {
      title: 'Error',
      error: 'Something went wrong loading the homepage'
    });
  }
};
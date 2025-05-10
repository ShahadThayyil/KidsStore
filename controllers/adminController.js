const Product = require('../models/product');
const About = require('../models/about');
const Contact = require('../models/contact');
const fs = require('fs');
const path = require('path');

// Admin dashboard
exports.getDashboard = async (req, res) => {
  try {
    const productsCount = await Product.countDocuments();
    const featuredCount = await Product.countDocuments({ featured: true });
    
    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      layout: 'layouts/admin',
      stats: {
        products: productsCount,
        featured: featuredCount
      }
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error loading dashboard');
    res.redirect('/admin/login');
  }
};

// Login page
exports.getLoginPage = (req, res) => {
  if (req.session.isAdmin) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', {
    title: 'Admin Login',
    layout: 'layouts/auth'
  });
};

// Handle login
exports.doLogin = (req, res) => {
  req.flash('success_msg', 'You are now logged in');
  res.redirect('/admin/dashboard');
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
};

// Products management
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    
    res.render('admin/products', {
      title: 'Manage Products',
      layout: 'layouts/admin',
      products
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error loading products');
    res.redirect('/admin/dashboard');
  }
};

// Add product form
exports.getAddProduct = (req, res) => {
  res.render('admin/add-product', {
    title: 'Add New Product',
    layout: 'layouts/admin'
  });
};

// Add product - POST
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    
    if (!req.file) {
      req.flash('error_msg', 'Please upload a PNG image');
      return res.redirect('/admin/products/add');
    }
    
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image: `/uploads/${req.file.filename}`
    });
    
    await newProduct.save();
    req.flash('success_msg', 'Product added successfully');
    res.redirect('/admin/products');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error adding product');
    res.redirect('/admin/products/add');
  }
};

// Edit product form
exports.getEditProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      req.flash('error_msg', 'Product not found');
      return res.redirect('/admin/products');
    }
    
    res.render('admin/edit-product', {
      title: 'Edit Product',
      layout: 'layouts/admin',
      product
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error loading product');
    res.redirect('/admin/products');
  }
};

// Update product - PUT
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, featured } = req.body;
    const isFeatured = featured === 'on';
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      req.flash('error_msg', 'Product not found');
      return res.redirect('/admin/products');
    }
    
    // Update product data
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.featured = isFeatured;
    
    // If new image uploaded
    if (req.file) {
      // Delete old image if it exists
      const oldImagePath = path.join(__dirname, '../public', product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      
      product.image = `/uploads/${req.file.filename}`;
    }
    
    await product.save();
    req.flash('success_msg', 'Product updated successfully');
    res.redirect('/admin/products');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error updating product');
    res.redirect('/admin/products');
  }
};

// Delete product - DELETE
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      req.flash('error_msg', 'Product not found');
      return res.redirect('/admin/products');
    }
    
    // Delete image file
    const imagePath = path.join(__dirname, '../public', product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    await Product.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Product deleted successfully');
    res.redirect('/admin/products');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error deleting product');
    res.redirect('/admin/products');
  }
};

// Manage featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ featured: -1, createdAt: -1 });
    
    res.render('admin/featured', {
      title: 'Manage Featured Products',
      layout: 'layouts/admin',
      products
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error loading featured products');
    res.redirect('/admin/dashboard');
  }
};

// Toggle featured status - PUT
exports.toggleFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      req.flash('error_msg', 'Product not found');
      return res.redirect('/admin/featured');
    }
    
    product.featured = !product.featured;
    await product.save();
    
    req.flash('success_msg', `Product ${product.featured ? 'added to' : 'removed from'} featured`);
    res.redirect('/admin/featured');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error updating featured status');
    res.redirect('/admin/featured');
  }
};

// About page management
exports.getAboutPage = async (req, res) => {
  try {
    const about = await About.findOrCreate();
    
    res.render('admin/about', {
      title: 'Manage About Page',
      layout: 'layouts/admin',
      about
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error loading about page data');
    res.redirect('/admin/dashboard');
  }
};

// Update about page - PUT
exports.updateAbout = async (req, res) => {
  try {
    const { title, content, mission, vision } = req.body;
    
    const about = await About.findOrCreate();
    
    about.title = title;
    about.content = content;
    about.mission = mission;
    about.vision = vision;
    about.updatedAt = Date.now();
    
    await about.save();
    
    req.flash('success_msg', 'About page updated successfully');
    res.redirect('/admin/about');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error updating about page');
    res.redirect('/admin/about');
  }
};

// Contact page management
exports.getContactPage = async (req, res) => {
  try {
    const contact = await Contact.findOrCreate();
    
    res.render('admin/contact', {
      title: 'Manage Contact Page',
      layout: 'layouts/admin',
      contact
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error loading contact page data');
    res.redirect('/admin/dashboard');
  }
};

// Update contact page - PUT
exports.updateContact = async (req, res) => {
  try {
    const { phone, email, address, whatsapp } = req.body;
    
    const contact = await Contact.findOrCreate();
    
    contact.phone = phone;
    contact.email = email;
    contact.address = address;
    contact.whatsapp = whatsapp;
    contact.updatedAt = Date.now();
    
    await contact.save();
    
    req.flash('success_msg', 'Contact information updated successfully');
    res.redirect('/admin/contact');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error updating contact information');
    res.redirect('/admin/contact');
  }
};
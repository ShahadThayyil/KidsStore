const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, adminLogin } = require('../middleware/auth');
const upload = require('../config/multer');

// Login routes
router.get('/login', adminController.getLoginPage);
router.post('/login', adminLogin, adminController.doLogin);
router.get('/logout', adminController.logout);

// Dashboard
router.get('/dashboard', isAuthenticated, adminController.getDashboard);

// Products management
router.get('/products', isAuthenticated, adminController.getProducts);
router.get('/products/add', isAuthenticated, adminController.getAddProduct);
router.post('/products', isAuthenticated, upload.single('image'), adminController.addProduct);
router.get('/products/edit/:id', isAuthenticated, adminController.getEditProduct);
router.put('/products/:id', isAuthenticated, upload.single('image'), adminController.updateProduct);
router.delete('/products/:id', isAuthenticated, adminController.deleteProduct);

// Featured products management
router.get('/featured', isAuthenticated, adminController.getFeaturedProducts);
router.put('/featured/:id', isAuthenticated, adminController.toggleFeatured);

// About page management
router.get('/about', isAuthenticated, adminController.getAboutPage);
router.put('/about', isAuthenticated, adminController.updateAbout);

// Contact information management
router.get('/contact', isAuthenticated, adminController.getContactPage);
router.put('/contact', isAuthenticated, adminController.updateContact);

module.exports = router;
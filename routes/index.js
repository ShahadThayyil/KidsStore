const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

// Homepage route
router.get('/', indexController.getHomepage);

module.exports = router;
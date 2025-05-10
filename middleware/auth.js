const bcrypt = require('bcryptjs');

// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.isAdmin) {
    return next();
  }
  req.flash('error_msg', 'Please log in to access this page');
  res.redirect('/admin/login');
};

// Admin login middleware
const adminLogin = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Check if username and password match
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      req.session.isAdmin = true;
      req.session.user = {
        username: process.env.ADMIN_USERNAME,
      };
      return next();
    }

    req.flash('error_msg', 'Invalid credentials');
    res.redirect('/admin/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An error occurred during login');
    res.redirect('/admin/login');
  }
};


module.exports = {
  isAuthenticated,
  adminLogin
};
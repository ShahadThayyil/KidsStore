require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ejsLayouts = require('express-ejs-layouts');

// Initialize app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://shahadvlooks4:dob03072008@userandnotes.d80ko.mongodb.net/kids_ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
  family: 4 // Force IPv4
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(ejsLayouts);
app.set('layout', 'layouts/main');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
      mongoUrl: process.env.MONGODB_URI || 'mongodb+srv://shahadvlooks4:dob03072008@userandnotes.d80ko.mongodb.net/kids_ecommerce',
      mongoOptions: {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        family: 4
      }
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
  })
);

// Flash messages
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  res.locals.isAdmin = req.session.isAdmin || false;
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/products', require('./routes/products'));
app.use('/about', require('./routes/about'));
app.use('/contact', require('./routes/contact'));
app.use('/admin', require('./routes/admin'));

// 404 Page
app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Page Not Found', layout: 'layouts/main' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
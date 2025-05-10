const About = require('../models/about');

exports.getAboutPage = async (req, res) => {
  try {
    const about = await About.findOrCreate();
    
    res.render('pages/about', {
      title: 'About Us',
      about
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('pages/error', {
      title: 'Error',
      error: 'Error loading about page'
    });
  }
};
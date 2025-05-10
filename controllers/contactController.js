const Contact = require('../models/contact');

exports.getContactPage = async (req, res) => {
  try {
    const contact = await Contact.findOrCreate();
    
    res.render('pages/contact', {
      title: 'Contact Us',
      contact
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('pages/error', {
      title: 'Error',
      error: 'Error loading contact page'
    });
  }
};
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  phone: {
    type: String,
    default: '+1 234-567-8900'
  },
  email: {
    type: String,
    default: 'contact@kidsstore.com'
  },
  address: {
    type: String,
    default: '123 Kids Street, Toy City, TC 12345'
  },
  whatsapp: {
    type: String,
    default: '+12345678900'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Make sure only one Contact document exists
ContactSchema.statics.findOrCreate = async function() {
  const contact = await this.findOne();
  if (contact) {
    return contact;
  }
  return this.create({});
};

module.exports = mongoose.model('Contact', ContactSchema);
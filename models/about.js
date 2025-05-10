const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'About Us'
  },
  content: {
    type: String,
    required: true,
    default: 'Welcome to our kids store! We provide high-quality products for children.'
  },
  mission: {
    type: String,
    default: 'Our mission is to provide safe, fun, and educational products for children.'
  },
  vision: {
    type: String,
    default: 'We envision a world where children can learn and grow through play.'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Make sure only one About document exists
AboutSchema.statics.findOrCreate = async function() {
  const about = await this.findOne();
  if (about) {
    return about;
  }
  return this.create({});
};

module.exports = mongoose.model('About', AboutSchema);
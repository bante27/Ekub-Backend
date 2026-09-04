const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully! ✅');
  } catch (err) {
    console.error('Database Connection Error ❌:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
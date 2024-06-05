const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://simaofraga10:KsjdrdErRo1n8l55@cluster0.jm48xxg.mongodb.net/drones');
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Fecha a aplicação em caso de falha na conexão
  }
};

module.exports = connectDB;

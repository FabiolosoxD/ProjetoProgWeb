const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://fabioricomaio:hBQoKUNH3VGBAWQ1@cluster0.3wnprx9.mongodb.net/');
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Fecha a aplicação em caso de falha na conexão
  }
};

module.exports = connectDB;

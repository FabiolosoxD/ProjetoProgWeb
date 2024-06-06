const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome da peça é obrigatório']
  },
  type: {
    type: String,
    required: [true, 'Tipo da peça é obrigatório']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantidade é obrigatória'],
    min: [0, 'A quantidade deve ser pelo menos 0']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Part = mongoose.model('Part', partSchema);
module.exports = Part;

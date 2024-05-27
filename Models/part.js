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
    min: [1, 'A quantidade deve ser pelo menos 1']
  }
}, {
  timestamps: true
});

const Part = mongoose.model('Part', partSchema);
module.exports = Part;

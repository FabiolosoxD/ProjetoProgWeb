const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definição do Esquema do Usuário
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Por favor, insira um email válido']
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'A senha deve ter pelo menos 6 caracteres']
  }
}, {
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

// Middleware do Mongoose para hash de senha antes de salvar o documento
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next(); // Se a senha não foi modificada, continua sem fazer nada

  // Gera um salt e usa-o para hash da senha
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash; // Substitui a senha plana pelo hash
      next();
    });
  });
});

// Método para comparar a senha fornecida com o hash armazenado
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model('User', userSchema);
module.exports = User;

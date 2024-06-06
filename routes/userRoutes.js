const express = require('express');
const router = express.Router();
const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Rota protegida para obter dados do user
router.get('/me', auth, async (req, res) => {
  try {
    // Usar o ID do user obtido do token JWT para buscar o user no banco de dados
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});
// Endpoint para registro de users
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      email,
      password
    });

    await user.save();
    res.status(201).send('User registered');
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para login de usuários
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }
  
      // Payload para o token
      const payload = {
        user: {
          id: user.id
        }
      };
  
      // Gerar o token JWT
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },  // Token expira em 1 hora
        (err, token) => {
          if (err) throw err;
          res.json({ token });  // Enviar o token como resposta
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: err.message });
    }
  });

// Endpoint para deletar um usuário
router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
  
      if (!user) {
        return res.status(404).send('User não encontrado');
      }
  
      res.send('User apagado com sucesso');
    } catch (error) {
      console.error('Erro ao apagar user:', error);
      res.status(500).json({ error: error.message });
    }
  });  

// Endpoint para listar todos os usuários
router.get('/all', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

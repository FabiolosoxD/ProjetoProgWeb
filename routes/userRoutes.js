const express = require('express');
const router = express.Router();
const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Rota protegida para obter dados do usuário
router.get('/me', auth, async (req, res) => {
  try {
    // Usar o ID do usuário obtido do token JWT para buscar o usuário no banco de dados
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});
// Endpoint para registro de usuários
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
    res.status(500).send('Server error');
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
      res.status(500).send('Server error');
    }
  });

// Endpoints de teste para apagar mais tarde 
router.get('/', async (req, res) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).send('Erro interno do servidor');
    }
});
// Endpoint para deletar um usuário
router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
  
      if (!user) {
        return res.status(404).send('Usuário não encontrado');
      }
  
      res.send('Usuário deletado com sucesso');
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).send('Erro interno do servidor');
    }
  });  

module.exports = router;

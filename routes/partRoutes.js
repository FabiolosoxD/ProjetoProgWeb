const express = require('express');
const router = express.Router();
const Part = require('../Models/part');

// Adicionar uma nova peça
router.post('/', async (req, res) => {
  try {
    const { name, type, quantity } = req.body;
    const part = new Part({ name, type, quantity });
    await part.save();
    res.status(201).json(part);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar todas as peças
router.get('/', async (req, res) => {
  try {
    const parts = await Part.find();
    res.status(200).json(parts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar uma peça
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, quantity } = req.body;
    const part = await Part.findByIdAndUpdate(id, { name, type, quantity }, { new: true });
    if (!part) {
      return res.status(404).json({ msg: 'Peça não encontrada' });
    }
    res.status(200).json(part);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar uma peça
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const part = await Part.findByIdAndDelete(id);
    if (!part) {
      return res.status(404).json({ msg: 'Peça não encontrada' });
    }
    res.status(200).json({ msg: 'Peça apagada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const DroneAssembly = require('../Models/droneAssembly');
const Part = require('../Models/part');

// Adicionar uma nova montagem de drone
router.post('/', async (req, res) => {
  try {
    const { droneModel, parts, assemblyDate, userId } = req.body;
    const partsWithNames = await Promise.all(parts.map(async part => {
      const partDetails = await Part.findById(part.partId);
      if (!partDetails) throw new Error(`Peça com ID ${part.partId} não encontrada`);
      return {
        partId: part.partId,
        partName: partDetails.name,
        quantity: part.quantity
      };
    }));

    const droneAssembly = new DroneAssembly({
      droneModel,
      parts: partsWithNames,
      assemblyDate,
      userId
    });
    await droneAssembly.save();
    res.status(201).json(droneAssembly);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar todas as montagens de drones
router.get('/', async (req, res) => {
  try {
    const droneAssemblies = await DroneAssembly.find().populate('parts.partId');
    res.status(200).json(droneAssemblies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Consultar montagens de drones por usuário
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const droneAssemblies = await DroneAssembly.find({ userId }).populate('parts.partId');
    res.status(200).json(droneAssemblies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar uma montagem de drone
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { droneModel, parts, assemblyDate } = req.body;
    const partsWithNames = await Promise.all(parts.map(async part => {
      const partDetails = await Part.findById(part.partId);
      if (!partDetails) throw new Error(`Peça com ID ${part.partId} não encontrada`);
      return {
        partId: part.partId,
        partName: partDetails.name,
        quantity: part.quantity
      };
    }));

    const droneAssembly = await DroneAssembly.findByIdAndUpdate(id, {
      droneModel,
      parts: partsWithNames,
      assemblyDate
    }, { new: true });
    if (!droneAssembly) {
      return res.status(404).json({ msg: 'Montagem de drone não encontrada' });
    }
    res.status(200).json(droneAssembly);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar uma montagem de drone
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const droneAssembly = await DroneAssembly.findByIdAndDelete(id);
    if (!droneAssembly) {
      return res.status(404).json({ msg: 'Montagem de drone não encontrada' });
    }
    res.status(200).json({ msg: 'Montagem de drone apagada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const DroneAssembly = require('../Models/droneAssembly');
const Part = require('../Models/part');
const auth = require('../middleware/auth');

// Adicionar uma nova montagem de drone
router.post('/', auth, async (req, res) => {
  try {
    const { droneModel, parts, assemblyDate } = req.body;
    const userId = req.user.id; // Pega o ID do usuário autenticado

    const partsWithNames = await Promise.all(parts.map(async part => {
      const partDetails = await Part.findById(part.partId);
      if (!partDetails) throw new Error(`Peça com ID ${part.partId} não encontrada`);
      if (partDetails.quantity < part.quantity) throw new Error(`Peça ${partDetails.name} não possui quantidade suficiente em estoque`);
      
      // Atualizar a quantidade em estoque
      partDetails.quantity -= part.quantity;
      await partDetails.save();

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
router.get('/', auth, async (req, res) => {
  try {
    const droneAssemblies = await DroneAssembly.find({ userId: req.user.id }).populate('parts.partId');
    res.status(200).json(droneAssemblies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Consultar montagens de drones por usuário
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId !== req.user.id) {
      return res.status(403).json({ msg: 'Acesso negado' });
    }
    const droneAssemblies = await DroneAssembly.find({ userId }).populate('parts.partId');
    res.status(200).json(droneAssemblies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar uma montagem de drone
router.patch('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { droneModel, parts, assemblyDate } = req.body;
    const userId = req.user.id;

    const droneAssembly = await DroneAssembly.findById(id);
    if (!droneAssembly || droneAssembly.userId.toString() !== userId) {
      return res.status(404).json({ msg: 'Montagem de drone não encontrada' });
    }

    const partsWithNames = await Promise.all(parts.map(async part => {
      const partDetails = await Part.findById(part.partId);
      if (!partDetails) throw new Error(`Peça com ID ${part.partId} não encontrada`);
      if (partDetails.quantity < part.quantity) throw new Error(`Peça ${partDetails.name} não possui quantidade suficiente em estoque`);

      // Atualizar a quantidade em estoque
      partDetails.quantity -= part.quantity;
      await partDetails.save();

      return {
        partId: part.partId,
        partName: partDetails.name,
        quantity: part.quantity
      };
    }));

    droneAssembly.droneModel = droneModel;
    droneAssembly.parts = partsWithNames;
    droneAssembly.assemblyDate = assemblyDate;
    await droneAssembly.save();

    res.status(200).json(droneAssembly);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Apagar uma montagem de drone
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const droneAssembly = await DroneAssembly.findById(id);
    if (!droneAssembly || droneAssembly.userId.toString() !== userId) {
      return res.status(404).json({ msg: 'Montagem de drone não encontrada' });
    }

    // Devolver as peças ao estoque
    await Promise.all(droneAssembly.parts.map(async part => {
      const partDetails = await Part.findById(part.partId);
      if (partDetails) {
        partDetails.quantity += part.quantity;
        await partDetails.save();
      }
    }));

    await DroneAssembly.deleteOne({ _id: id });
    res.status(200).json({ msg: 'Montagem de drone apagada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

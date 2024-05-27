const mongoose = require('mongoose');

const droneAssemblySchema = new mongoose.Schema({
  droneModel: {
    type: String,
    required: [true, 'Modelo do drone é obrigatório']
  },
  parts: [{
    partId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Part',
      required: true
    },
    partName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  assemblyDate: {
    type: Date,
    required: [true, 'Data de montagem é obrigatória']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
}, {
  timestamps: true
});

const DroneAssembly = mongoose.model('DroneAssembly', droneAssemblySchema);
module.exports = DroneAssembly;

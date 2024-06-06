require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const partRoutes = require('./routes/partRoutes');
const droneAssemblyRoutes = require('./routes/droneAssemblyRoutes');

const app = express();

// Conectar ao banco de dados
connectDB();

app.use(express.json());

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/parts', partRoutes);
app.use('/api/drone-assemblies', droneAssemblyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

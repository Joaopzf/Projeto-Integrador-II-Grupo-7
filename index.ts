import express from 'express';
import withdrawRoutes from './routes/withdrawRoutes';

const app = express();
app.use(express.json()); // Middleware para parsear JSON

// Registrar a rota de saque
app.use('/api', withdrawRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

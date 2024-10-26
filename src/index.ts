import express from 'express';
//PARTE 1
import evaluateNewEventRoutes from './routes/evaluateNewEventRoutes';

const app = express();
app.use(express.json()); // Middleware para parsear JSON

// Registrar as rotas
app.use('/api', evaluateNewEventRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

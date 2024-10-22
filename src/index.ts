import express from 'express';
//PARTE 1
import signUpRoutes from './routes/signUpRoutes';

const app = express();
app.use(express.json()); // Middleware para parsear JSON


// Registrar as rotas
app.use('/api', signUpRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

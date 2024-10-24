import express from 'express';
//PARTE 1
import deleteEventRoutes from './routes/deleteEventRoutes';

const app = express();
app.use(express.json()); // Middleware para parsear JSON


app.use('/api', deleteEventRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

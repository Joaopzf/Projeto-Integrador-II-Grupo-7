import express from "express";
//PARTE 1
import evaluateNewEventRoutes from "./routes/evaluateNewEventRoutes";
import deleteEventRoutes from "./routes/deleteEventRoutes";
// Importa as rotas de avaliação
//PARTE 2
import addFundsRoutes from "./routes/addFundsRoutes";

import signUpRoutes from "./routes/signUpRoutes";

const app = express();
app.use(express.json()); // Middleware para parsear JSON

// Registrar as rotas
app.use("/api", evaluateNewEventRoutes);
app.use("/events", deleteEventRoutes);
// Registrar as rotas

app.use("/funds", addFundsRoutes);

// Registrar as rotas
app.use("/signup", signUpRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

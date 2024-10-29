import express from "express";
import evaluateNewEventRoutes from "./routes/evaluateNewEventRoutes";
import deleteEventRoutes from "./routes/deleteEventRoutes";
import addFundsRoutes from "./routes/addFundsRoutes";
import signUpRoutes from "./routes/signUpRoutes";
import withdrawRoutes from "./routes/withdrawRoutes";

const app = express();
app.use(express.json()); // Middleware para parsear JSON

// Registrar as rotas
app.use("/api", evaluateNewEventRoutes);
app.use("/api", deleteEventRoutes);
app.use("/api", addFundsRoutes);
app.use("/api", signUpRoutes);
app.use("/api", withdrawRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

import express from "express";
//PARTE 1
import deleteEventRoutes from "./routes/deleteEventRoutes";
import signUpRoutes from "./routes/signUpRoutes";

const app = express();
app.use(express.json()); // Middleware para parsear JSON

app.use("/events", deleteEventRoutes);
// Registrar as rotas
app.use("/signup", signUpRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

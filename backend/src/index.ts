import dotenv from 'dotenv';
import express from "express";
import cors from 'cors';
import helmet from "helmet";
import evaluateNewEventRoutes from "./routes/evaluateNewEventRoutes";
import deleteEventRoutes from "./routes/deleteEventRoutes";
import addFundsRoutes from "./routes/addFundsRoutes";
import signUpRoutes from "./routes/signUpRoutes";
import withdrawRoutes from "./routes/withdrawRoutes";
import searchEventRoutes from "./routes/searchEventRoutes";
import betOnEventRoutes from "./routes/betOnEventRoutes";
import finishEventRoutes from "./routes/finishEventRoutes";
import addNewEventRoutes from "./routes/addNewEventRoutes";
import getEventsRoutes from "./routes/getEventsRoutes";
import loginRoutes from "./routes/loginRoutes";
import walletRoutes from "./routes/walletRoutes";

dotenv.config();

const app = express();

// Configuração básica do Helmet com CSP
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"], 
    },
  })
);

// Configuração do CORS
app.use(cors({
  origin: "http://localhost:3001", // Permitir frontend na porta 3001
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para parsear JSON
app.use(express.json());

// Registrar rotas
app.use("/api", evaluateNewEventRoutes);
app.use("/api", deleteEventRoutes);
app.use("/api", addFundsRoutes);
app.use("/api", signUpRoutes);
app.use("/api", withdrawRoutes);
app.use("/api", searchEventRoutes);
app.use("/api", betOnEventRoutes);
app.use("/api", finishEventRoutes);
app.use('/api', addNewEventRoutes);
app.use('/api', getEventsRoutes);
app.use('/api', loginRoutes);   
app.use('/api/wallet', walletRoutes);

// Inicializar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});

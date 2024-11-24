import express from "express";
import cors from 'cors';
import path from "path";
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

const app = express();

// Configuração do Express para servir arquivos estáticos da pasta 'frontend'
app.use('/homepage', express.static(path.join(__dirname, '../../frontend/homepage'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    }
  }
}));

app.use((req, res, next) => {
  console.log(`Requisição recebida para: ${req.url}`);
  next();
});

// Configuração básica do Helmet com CSP
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
    },
  })
);

// Configuração do CORS para permitir requisições do frontend no localhost:3001
app.use(cors({
  origin: "http://localhost:3001",  // Permite o frontend da porta 3001
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Permite os métodos usados
  allowedHeaders: ['Content-Type', 'Authorization'],  // Permite os cabeçalhos necessários
}));

// Middleware para parsear JSON
app.use(express.json());

// Registrar as rotas
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

// Para servir o arquivo static da homepage
app.get('/frontend/homepage/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/homepage/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

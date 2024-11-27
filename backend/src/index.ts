import express from "express"; // Importa o framework Express
import cors from 'cors'; // Importa o middleware para configurar CORS
import path from "path"; // Importa o módulo 'path' para manipulação de caminhos de arquivos
import helmet from "helmet"; // Importa o Helmet para aumentar a segurança
import evaluateNewEventRoutes from "./routes/evaluateNewEventRoutes"; // Importa as rotas para avaliação de novos eventos
import deleteEventRoutes from "./routes/deleteEventRoutes"; // Importa as rotas para deletar eventos
import addFundsRoutes from "./routes/addFundsRoutes"; // Importa as rotas para adicionar fundos
import signUpRoutes from "./routes/signUpRoutes"; // Importa as rotas para cadastro de usuários
import withdrawRoutes from "./routes/withdrawRoutes"; // Importa as rotas para saque de fundos
import searchEventRoutes from "./routes/searchEventRoutes"; // Importa as rotas para buscar eventos
import betOnEventRoutes from "./routes/betOnEventRoutes"; // Importa as rotas para apostas em eventos
import finishEventRoutes from "./routes/finishEventRoutes"; // Importa as rotas para finalizar eventos
import addNewEventRoutes from "./routes/addNewEventRoutes"; // Importa as rotas para adicionar novos eventos
import getEventsRoutes from "./routes/getEventsRoutes"; // Importa as rotas para obter eventos
import loginRoutes from "./routes/loginRoutes"; // Importa as rotas para login de usuários

const app = express(); // Cria uma instância do Express

// Configuração do Express para servir arquivos estáticos da pasta 'frontend'
app.use('/homepage', express.static(path.join(__dirname, '../../frontend/homepage'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css'); // Configura o tipo de conteúdo para arquivos CSS
    }
  }
}));

// Serve arquivos JavaScript estáticos
app.use('/js', express.static(path.join(__dirname, '../../frontend/js')));

// Middleware para logar as requisições recebidas
app.use((req, res, next) => {
  console.log(`Requisição recebida para: ${req.url}`); // Exibe o URL da requisição
  next(); // Chama o próximo middleware
});

// Configuração básica do Helmet com Content Security Policy (CSP)
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Permite carregar conteúdo apenas do mesmo domínio
      styleSrc: ["'self'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"], // Permite carregar estilos do Google Fonts e JSDelivr
      fontSrc: ["'self'", "https://fonts.gstatic.com"], // Permite carregar fontes do Google Fonts
    },
  })
);

// Configuração do CORS para permitir requisições do frontend no localhost:3001
app.use(cors({
  origin: "http://localhost:3001",  // Permite o frontend que está na porta 3001
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Permite os métodos usados no sistema
  allowedHeaders: ['Content-Type', 'Authorization'],  // Permite os cabeçalhos necessários
}));

// Middleware para parsear o corpo das requisições em JSON
app.use(express.json());

// Registra as rotas do sistema
app.use("/api", evaluateNewEventRoutes); // Rotas para avaliação de eventos
app.use("/api", deleteEventRoutes); // Rotas para deletar eventos
app.use("/api", addFundsRoutes); // Rotas para adicionar fundos
app.use("/api", signUpRoutes); // Rotas para cadastro de usuários
app.use("/api", withdrawRoutes); // Rotas para saque
app.use("/api", searchEventRoutes); // Rotas para pesquisa de eventos
app.use("/api", betOnEventRoutes); // Rotas para apostas em eventos
app.use("/api", finishEventRoutes); // Rotas para finalizar eventos
app.use('/api', addNewEventRoutes); // Rotas para adicionar novos eventos
app.use('/api', getEventsRoutes); // Rotas para obter eventos
app.use('/api', loginRoutes); // Rotas para login de usuários

// Rota para servir o arquivo static da homepage
app.get('/frontend/homepage/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/homepage/index.html')); // Envia o arquivo HTML da homepage
});

const PORT = process.env.PORT || 3000; // Define a porta do servidor, ou usa a porta definida no ambiente
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`); // Exibe mensagem no console quando o servidor estiver rodando
});

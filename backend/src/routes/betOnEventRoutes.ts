import express, { Request, Response, Router } from "express"; // Express para definir as rotas e tipos
import { betOnEvent } from "../services/betOnEvent"; // Função responsável pela lógica da aposta

// Criando uma instância do Router para definir as rotas
const router: Router = express.Router();

// Função responsável por lidar com a requisição de aposta em um evento
const handleBetOnEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    // Desestruturando os dados da requisição
    const { email, eventId, betAmount } = req.body;

    // Verificação de dados obrigatórios
    // Se faltar algum dos campos, retorna um erro 400
    if (!email || !eventId || !betAmount) {
      res
        .status(400)
        .json({
          error: "Campos obrigatórios ausentes: email, eventId ou betAmount.",
        });
      return;
    }

    // Chama a função betOnEvent para processar a aposta no evento
    const message = await betOnEvent(email, eventId, betAmount);
    
    // Retorna a resposta com status 201 e a mensagem de sucesso
    res.status(201).json({ message });
  } catch (error) {
    // Tratamento de erro caso algo dê errado durante o processo
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: `Erro ao realizar a aposta: ${error.message}` });
    } else {
      // Caso o erro seja desconhecido, retorna uma mensagem genérica de erro
      res
        .status(500)
        .json({ error: "Erro desconhecido ao realizar a aposta." });
    }
  }
};

// Define a rota POST para realizar a aposta em um evento
router.post("/betOnEvent", handleBetOnEvent);

// Exporta o roteador para ser utilizado em outras partes da aplicação
export default router;

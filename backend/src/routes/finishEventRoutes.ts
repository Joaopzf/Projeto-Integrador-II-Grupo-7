// Importa as dependências necessárias do Express e a função finishEvent
import express, { Request, Response, Router } from "express";
import { finishEvent } from "../services/finishEvent";

// Cria uma instância do Router para definir as rotas
const router: Router = express.Router();

// Função responsável por lidar com a requisição para finalizar um evento
const handleFinishEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Desestrutura os dados enviados no corpo da requisição
    const { event_id, result } = req.body;

    // Obtém o ID do moderador do cabeçalho da requisição
    const moderatorId = Number(req.headers["moderator-id"]);

    // Verifica se o ID do evento foi fornecido e se é um número válido
    if (!event_id || typeof event_id !== "number") {
      res.status(400).json({ error: "ID do evento inválido." });
      return; // Encerra a execução para evitar continuar com dados inválidos
    }

    // Verifica se o resultado foi fornecido e se é maior que 0
    if (result === undefined || result <= 0) {
      res.status(400).json({ error: "Resultado inválido." });
      return; // Encerra a execução em caso de erro
    }

    // Verifica se o ID do moderador foi fornecido
    if (!moderatorId) {
      res.status(400).json({ error: "ID do moderador é necessário." });
      return; // Encerra a execução em caso de erro
    }

    // Chama a função finishEvent para processar a finalização do evento
    const message = await finishEvent({
      eventId: event_id, 
      result, 
      moderatorId, 
    });

    // Retorna uma resposta de sucesso com o resultado
    res.status(200).json({ message });
  } catch (error) {
    // Trata erros que podem ocorrer durante o processamento
    const errorMessage =
      error instanceof Error
        ? `Erro ao finalizar o evento: ${error.message}` // Mensagem de erro detalhada
        : "Erro desconhecido ao finalizar o evento."; // Mensagem genérica para erros não identificados
    res.status(500).json({ error: errorMessage });
  }
};

// Define a rota POST para finalizar um evento
router.post("/finish", handleFinishEvent);

// Exporta o roteador para ser usado em outras partes da aplicação
export default router;

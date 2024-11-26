import express, { Request, Response, Router } from 'express';
import { getEventsFromDatabase } from '../services/getEvents';

const router: Router = express.Router();

// Função que lida com a requisição de busca de eventos
const handleGetEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;  // Obtém o parâmetro de busca da query string

    // Se não houver busca, faz uma busca por todos os eventos
    const cleanedSearch = search ? (search as string).trim() : '';

    console.log(`Buscando eventos com o nome: ${cleanedSearch}`);

    // Chama a função para buscar eventos no banco de dados
    const events = await getEventsFromDatabase(cleanedSearch);

    res.status(200).json(events);  // Retorna os eventos encontrados
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    res.status(500).json({ error: "Erro ao buscar eventos" });
  }
};

// Define a rota GET para "/api/events"
router.get('/events', handleGetEvents);

export default router;

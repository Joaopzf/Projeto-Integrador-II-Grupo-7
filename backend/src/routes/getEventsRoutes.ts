// Importa o Express, tipos necessários e a função de serviço para buscar eventos
import express, { Request, Response, Router } from 'express';
import { getEventsFromDatabase } from '../services/getEvents';

// Cria um novo roteador para gerenciar as rotas relacionadas a eventos
const router: Router = express.Router();

// Função que lida com a requisição GET para buscar eventos
const handleGetEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtém o parâmetro de busca da query string da requisição
    const { search } = req.query;

    // Remove espaços extras do parâmetro de busca ou define como string vazia se não houver busca
    const cleanedSearch = search ? (search as string).trim() : '';

    // Loga no console a busca que será realizada
    console.log(`Buscando eventos com o nome: ${cleanedSearch}`);

    // Chama a função que interage com o banco de dados para buscar os eventos
    const events = await getEventsFromDatabase(cleanedSearch);

    // Retorna uma resposta HTTP com status 200 e os eventos encontrados no formato JSON
    res.status(200).json(events);
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    // Retorna uma resposta HTTP com status 500 e uma mensagem de erro
    res.status(500).json({ error: "Erro ao buscar eventos" });
  }
};

// Define a rota GET para "/api/events", que usará a função handleGetEvents
router.get('/events', handleGetEvents);

// Exporta o roteador para que ele possa ser utilizado em outras partes do aplicativo
export default router;

import express, { Request, Response, Router } from 'express'; // Importa as dependências necessárias do Express
import { searchEvents } from '../services/searchEvents'; // Serviço responsável por realizar a busca no banco de dados

// Cria uma instância do Router para configurar as rotas de busca de eventos
const router: Router = express.Router();

// Função que lida com a requisição de busca de eventos
const handleSearchEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extrai o parâmetro de busca, que é keyword, da query string da requisição
        const { keyword } = req.query;

        // Verifica se a palavra-chave foi fornecida
        if (!keyword) {
            res.status(400).json({ error: 'Palavra-chave é obrigatória para busca.' }); // Retorna erro 400 se estiver ausente
            return; 
        }

        // Chama o serviço de busca para encontrar eventos correspondentes à palavra-chave
        const events = await searchEvents(keyword as string);

        // Retorna os eventos encontrados com status HTTP 200 (sucesso)
        res.status(200).json(events);
    } catch (error) {
        // Trata erros, diferenciando entre erros conhecidos e desconhecidos
        if (error instanceof Error) {
            // Retorna erro 500 com mensagem detalhada
            res.status(500).json({ error: `Erro ao buscar eventos: ${error.message}` });
        } else {
            // Retorna erro 500 com mensagem 
            res.status(500).json({ error: 'Erro desconhecido ao buscar eventos.' });
        }
    }
};

// Define a rota GET para busca de eventos no endpoint "/searchEvent"
router.get('/searchEvent', handleSearchEvent);

// Exporta o roteador para que ele seja usado em outras partes da aplicação
export default router;

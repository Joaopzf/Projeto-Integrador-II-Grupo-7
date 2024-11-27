import express, { Request, Response, Router } from 'express'; // Express para manipular rotas 
import { evaluateNewEvent } from '../services/evaluateNewEvent'; // Função que contém a lógica de avaliar novos eventos

// Criando uma instância do Router para definir as rotas
const router: Router = express.Router();

// Função responsável para lidar com a requisição de avaliação de eventos
const handleEvaluateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        // Desestruturando os dados enviados no corpo da requisição
        const { eventId, moderatorId, action, reason } = req.body;

        // Se faltar algum dos campos obrigatórios, retorna um erro 400
        if (!eventId || !moderatorId || !action) {
            res.status(400).json({ error: 'Campos obrigatórios ausentes: eventId, moderatorId, ou action.' });
            return;
        }

        // Validação para garantir que a ação seja válida
        const validActions = ['approve', 'reject']; // Lista de ações válidas
        if (!validActions.includes(action)) {
            res.status(400).json({ error: 'Ação inválida. Use "approve" ou "reject".' });
            return;
        }

        // Verificação se a razão foi fornecida ao rejeitar um evento
        if (action === 'reject' && !reason) {
            res.status(400).json({ error: 'Uma razão deve ser fornecida ao rejeitar um evento.' });
            return;
        }

        // Chama a função evaluateNewEvent para processar a avaliação do evento
        const message = await evaluateNewEvent(eventId, moderatorId, action, reason);

        // Retorna a mensagem de sucesso com status 200
        res.status(200).json({ message });
    } catch (error) {
        // Tratamento de erro caso algo dê errado durante o processo
        if (error instanceof Error) {
            res.status(500).json({ error: `Erro ao avaliar o evento: ${error.message}` });
        } else {
            // Caso o erro seja desconhecido, retorna uma mensagem genérica de erro
            res.status(500).json({ error: 'Erro desconhecido ao avaliar o evento.' });
        }
    }
};

// Define a rota POST para avaliar um evento
router.post('/evaluate', handleEvaluateEvent);

// Exporta o roteador para ser utilizado em outras partes da aplicação
export default router;

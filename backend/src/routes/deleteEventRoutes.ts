import express, { Request, Response, Router } from 'express'; // Express para manipulação de rotas e tipos
import { deleteEvent } from '../services/deleteEvent'; // Função que contém a lógica para excluir um evento

// Criando uma instância do Router para definir as rotas
const router: Router = express.Router();

// Função responsável por lidar com a requisição para excluir um evento
const handleDeleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        // Desestruturando os dados enviados no corpo da requisição
        const { eventId, userId } = req.body;

        // Verificação de dados obrigatórios
        // Se faltar algum dos campos, retorna erro 400
        if (!eventId || !userId) {
            res.status(400).json({ error: 'Campos obrigatórios ausentes: eventId ou userId.' });
            return;
        }

        // Chama a função deleteEvent para remover o evento do banco de dados
        const message = await deleteEvent(eventId, userId);

        // Se a remoção for bem sucedida, retorna a mensagem de sucesso com status 200
        res.status(200).json({ message });
    } catch (error) {
        // Tratamento de erro caso algum erro ocorra durante o processo
        if (error instanceof Error) {
            res.status(500).json({ error: `Erro ao remover o evento: ${error.message}` });
        } else {
            // Caso o erro seja desconhecido, retorna uma mensagem genérica
            res.status(500).json({ error: 'Erro desconhecido ao remover o evento.' });
        }
    }
};

// Define a rota POST para excluir um evento
router.post('/deleteEvent', handleDeleteEvent);

// Exporta o roteador para ser utilizado em outras partes da aplicação
export default router;

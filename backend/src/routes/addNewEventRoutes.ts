import pool from '../db/mysql'; // Conexão com o banco de dados MySQL
import express, { Request, Response, Router } from 'express'; // Importação das dependências do Express
import { addNewEvent } from '../services/addNewEvent'; // Função que lida com a criação de eventos no banco de dados

// Criando uma instância do Router do Express para definir as rotas
const router: Router = express.Router();

// Função responsável por lidar com a requisição para adicionar um novo evento
const handleAddNewEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        // Desestruturando os dados enviados na requisição
        const { name, date, description, createdBy } = req.body;

        // Verificação de dados obrigatórios
        // Se faltar algum campo essencial, retorna um erro 400
        if (!name || !date || !createdBy) {
            res.status(400).json({ error: 'Campos obrigatórios ausentes: name, date ou createdBy.' });
            return;
        }

        // Verifica se o usuário que está criando o evento existe no banco de dados
        const userQuery = 'SELECT id FROM users WHERE id = ?';
        const [users] = await pool.execute(userQuery, [createdBy]) as [Array<{ id: number }>, any];

        // Se o usuário não for encontrado, retorna um erro 404
        if (users.length === 0) {
            res.status(404).json({ error: 'Usuário não encontrado.' });
            return;
        }

        // Chama a função addNewEvent para adicionar um novo evento no banco de dados
        const { message, eventId } = await addNewEvent({ name, date, description, createdBy });
        
        // Se o evento for adicionado com sucesso, retorna a resposta com o status 201 (Criado)
        res.status(201).json({ message, eventId });
    } catch (error) {
        // Caso algum erro ocorra durante o processo, retorna um erro com o código 500
        if (error instanceof Error) {
            res.status(500).json({ error: `Erro ao adicionar o evento: ${error.message}` });
        } else {
            // Caso o erro seja desconhecido, retorna uma mensagem genérica de erro
            res.status(500).json({ error: 'Erro desconhecido ao adicionar o evento.' });
        }
    }
};

// Define a rota POST para adicionar um novo evento
router.post('/addNewEvent', handleAddNewEvent);

// Exporta o roteador para ser utilizado em outras partes da aplicação
export default router;

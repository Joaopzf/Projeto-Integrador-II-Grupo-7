import express, { Request, Response, Router } from 'express';
import { addNewEvent } from '../services/addNewEvent';
import pool from '../db/mysql';

const router: Router = express.Router();

// Função responsável por lidar com a requisição para adicionar um novo evento
const handleAddNewEvent = async (req: Request, res: Response): Promise<void> => {
    console.log("Dados recebidos no backend:", req.body);
    console.log("UserId recebido na URL:", req.params.userId);

  try {
    // Captura o userId da URL e converte para número
    const { userId } = req.params;
    const userIdNumber = Number(userId);  // Converte para número
    
    if (isNaN(userIdNumber)) {
      res.status(400).json({ error: 'User ID inválido.' });
      return;
    }

    // Desestruturando os dados enviados no corpo da requisição
    const { name, description, quota, betStartDate, betEndDate, eventDate } = req.body;

    // Verificação de dados obrigatórios
    if (!name || !description || !quota || !betStartDate || !betEndDate || !eventDate) {
      res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
      return;
    }

    // Validação de dados
    if (isNaN(quota) || quota < 1) {
      res.status(400).json({ error: 'A quota deve ser um número válido e maior que 0.' });
      return;
    }

    const now = new Date();
    if (new Date(betStartDate) <= now) {
        res.status(400).json({ error: "A data de início das apostas deve ser no futuro." });
        return;
    }

    // Verifica se o usuário existe no banco de dados
    const userQuery = 'SELECT id FROM users WHERE id = ?';
    const [users] = await pool.execute(userQuery, [userIdNumber]) as [Array<{ id: number }>, any];
    
    if (users.length === 0) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }

    // Chama a função addNewEvent para adicionar o evento no banco
    const { message, eventId } = await addNewEvent({
      name,
      description,
      quota,
      betStartDate,
      betEndDate,
      eventDate,
      createdBy: userIdNumber,  // Passa o userIdNumber para o banco
    });

    // Retorna o ID do evento criado e a mensagem de sucesso
    res.status(201).json({ message, eventId });
  } catch (error: unknown) {
    // Tipagem correta do erro
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erro desconhecido ao adicionar o evento.' });
    }
  }
};

// Define a rota POST para criar um novo evento, recebendo o userId pela URL
router.post('/addNewEvent/:userId', handleAddNewEvent);

export default router;

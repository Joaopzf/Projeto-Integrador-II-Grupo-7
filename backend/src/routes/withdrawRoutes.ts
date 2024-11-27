import express, { Request, Response, NextFunction } from 'express';
import { withdrawFunds } from '../services/withdrawFunds'; // Certifique-se de que o caminho está correto
import authenticateToken from '../middleware/authenticator'; // Importando o middleware

const router = express.Router();

// Interface personalizada para incluir propriedades adicionais se necessário
interface CustomRequest extends Request {
    user?: any; 
}

// Rota para retirar fundos da carteira
router.post('/withdraw-funds', authenticateToken, async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user.id; // Obtém o ID do usuário do objeto user
        if (!userId) {
            res.status(400).json({ error: 'User  ID is required' });
            return;
        }

        const { amount, bankDetails }: { amount: number; bankDetails: any } = req.body; // Inclua bankDetails

        const result = await withdrawFunds(userId, amount, bankDetails); // Chama a função withdrawFunds com todos os argumentos
        res.status(200).json(result); // Retorna o resultado da retirada de fundos
    } catch (error) {
        console.error('Erro ao retirar fundos:', error);
        res.status(500).json({ error: 'Internal server error' });
        next(error); // Passa o erro para o próximo middleware
    }
});

export default router;
import express, { Request, Response, NextFunction } from 'express';
import { addFunds } from '../services/addFunds'; 
import { CreditCardDetails } from '../models/wallets'; 
import authenticateToken from '../middleware/authenticator'; // Importando o middleware

const router = express.Router();

// Interface personalizada para incluir propriedades adicionais se necessário
interface CustomRequest extends Request {
    user?: any; 
}

// Rota para adicionar fundos à carteira
router.post('/add-funds', authenticateToken, async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user.id; // Obtém o ID do usuário do objeto user
        if (!userId) {
            res.status(400).json({ error: 'User  ID is required' });
            return;
        }

        const { amount, creditCardDetails }: { amount: number; creditCardDetails: CreditCardDetails } = req.body;

        // Verifique se creditCardDetails está definido
        if (!creditCardDetails) {
            res.status(400).json({ error: 'Credit card details are required' });
            return;
        }

        const result = await addFunds(userId, amount, creditCardDetails);
        res.status(200).json(result); // Retorna o resultado da adição de fundos
    } catch (error) {
        console.error('Erro ao adicionar fundos:', error);
        res.status(500).json({ error: 'Internal server error' });
        next(error); // Passa o erro para o próximo middleware
    }
});

export default router;
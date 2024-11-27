import express, { Request, Response, NextFunction } from 'express';
import { Wallet } from '../models/wallets'; 
import { getWalletById } from '../services/walletService'; 

const router = express.Router();

// Interface personalizada para incluir propriedades adicionais se necessário
interface CustomRequest extends Request {
    userId?: number; 
}

// Rota para obter a carteira de um usuário
router.get('/wallet', async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.userId; // Obtém o ID do usuário do request
        if (!userId) {
            res.status(400).json({ error: 'User  ID is required' });
            return;
        }

        const wallet: Wallet | null = await getWalletById(userId); 
        if (!wallet) {
            res.status(404).json({ error: 'Wallet not found' });
            return;
        }

        res.status(200).json(wallet); // Retorna a carteira encontrada
    } catch (error) {
        console.error('Erro ao obter a carteira:', error);
        res.status(500).json({ error: 'Internal server error' });
        next(error); // Passa o erro para o próximo middleware
    }
});


export default router;
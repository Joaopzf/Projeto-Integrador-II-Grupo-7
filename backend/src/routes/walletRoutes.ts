import express, { Request, Response, NextFunction } from 'express';
import { Wallet } from '../models/wallets'; 
import { getWalletById } from '../services/walletService'; 
import authenticateToken from '../middleware/authenticator'; // Importando o middleware

const router = express.Router();

// Interface personalizada para incluir propriedades adicionais se necessário
interface CustomRequest extends Request {
    user?: any; 
}

// Rota para obter a carteira de um usuário
router.get('/wallet', authenticateToken, async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user.id; // Obtém o ID do usuário do objeto user
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

// Rota para obter o saldo da carteira
router.get('/wallet/:userId/balance', async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.params.userId); // Use req.params.userId

    // Verifica se a conversão foi bem-sucedida
    if (isNaN(userId)) {
        res.status(400).json({ error: 'ID Inválido' });
        return;
    }

    // Aqui você deve buscar a carteira pelo ID, por exemplo, usando um serviço
    const wallet: Wallet | null = await getWalletById(userId); // Supondo que você tenha uma função para isso

    if (wallet) {
        res.json({ balance: wallet.balance });
    } else {
        res.status(404).send('Carteira não encontrada');
    }
});

export default router;
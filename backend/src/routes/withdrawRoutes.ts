import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Wallet } from '../models/wallets'; 
import { getWalletById } from '../services/walletService'; 

const router = express.Router();

// Interface personalizada para incluir propriedades adicionais se necessário
interface CustomRequest extends Request {
    userId?: number; 
}

// Rota para processar saques
router.post('/withdraw', async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Supondo que o token é enviado no cabeçalho Authorization
        if (!token) {
            res.status(401).json({ error: 'Token não fornecido' });
            return;
        }

        // Verifica e decodifica o token
        const decoded: any = jwt.verify(token, 'projetointegrador'); // Substitua pela sua chave secreta
        const userId = Number(decoded.userId); // Convertendo para number
        if (isNaN(userId)) {
            res.status(401).json({ error: 'User  ID inválido' });
            return;
        }

        const { amount, bankDetails } = req.body;
        const { bankName, agencyNumber, accountNumber, pixKey } = bankDetails; // Extraindo os detalhes do banco

        // Verifique se todos os campos necessários estão definidos
        if (!amount || !bankDetails || !bankName || !agencyNumber || !accountNumber) {
            res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
            return;
        }

        // Aqui você pode adicionar a lógica para processar o saque
        // Exemplo: Verifique se o usuário tem saldo suficiente na carteira
        const wallet: Wallet | null = await getWalletById(userId);
        if (!wallet || wallet.balance < amount) {
            res.status(400).json({ error: 'Saldo insuficiente' });
            return;
        }

        // Lógica para processar o saque (exemplo fictício)
        // await processWithdrawal(userId, amount, bankDetails);

        res.status(200).json({ message: 'Saque processado com sucesso.' });
    } catch (error) {
        console.error('Erro ao processar o saque:', error);
        res.status(500).json({ error: 'Internal server error' });
        next(error); // Passa o erro para o próximo middleware
    }
});

export default router;
import express, { Request, Response, Router } from 'express';
import { addFunds } from '../services/addFunds'; // Certifique-se de que esse caminho está correto.

const router: Router = express.Router();

const handleAddFunds = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, amount, bankDetails } = req.body;

        // Verificação de dados obrigatórios
        if (!userId || !amount || !bankDetails) {
            res.status(400).json({ error: 'Campos obrigatórios ausentes: userId, amount, ou bankDetails.' });
            return;
        }

        // Validação para garantir que o valor seja positivo
        if (amount <= 0) {
            res.status(400).json({ error: 'O valor a ser adicionado deve ser maior que zero.' });
            return;
        }

        // Validação para garantir que as informações bancárias estejam corretas
        const { bank_name, agency_number, account_number, pix_key } = bankDetails;
        if (!bank_name || !agency_number || !account_number || !pix_key) {
            res.status(400).json({ error: 'Informe todos os detalhes bancários: bank_name, agency_number, account_number e pix_key.' });
            return;
        }

        // Chama o serviço para adicionar fundos
        const message = await addFunds(userId, amount, { bank_name, agency_number, account_number, pix_key });
        res.status(200).json({ message });
    } catch (error) {
        // Tratamento de erro detalhado
        console.error('Erro no handleAddFunds:', error);
        if (error instanceof Error) {
            res.status(500).json({ error: `Erro ao processar o depósito: ${error.message}` });
        } else {
            res.status(500).json({ error: 'Erro desconhecido ao processar o depósito.' });
        }
    }
};

router.post('/addFunds', handleAddFunds);

export default router;

import express, { Request, Response, Router } from 'express';
import { addFunds } from '../services/addFunds'; 

const router: Router = express.Router();

const handleAddFunds = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, amount, bankDetails } = req.body;

        // Verificação de dados obrigatórios
        if (!userId || amount === undefined || !bankDetails) {
            res.status(400).json({ error: 'Campos obrigatórios ausentes: userId, amount, ou bankDetails.' });
            return;
        }

        // Validação para garantir que o valor seja positivo
        if (amount <= 0) {
            res.status(400).json({ error: 'O valor a ser adicionado deve ser maior que zero.' });
            return;
        }

        // Verificação se pelo menos os dados bancários ou a chave PIX estão presentes
        const hasBankDetails = bankDetails.bank_name && bankDetails.agency_number && bankDetails.account_number;
        const hasPixKey = bankDetails.pix_key;

        if (!hasBankDetails && !hasPixKey) {
            res.status(400).json({ error: 'É necessário fornecer dados bancários ou uma chave PIX.' });
            return;
        }

        // Se dados bancários são fornecidos, valida se estão completos
        if (hasBankDetails && (!bankDetails.bank_name || !bankDetails.agency_number || !bankDetails.account_number)) {
            res.status(400).json({ error: 'Informe todos os detalhes bancários: bank_name, agency_number e account_number.' });
            return;
        }

        const message = await addFunds(userId, amount, bankDetails);
        res.status(200).json({ message });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `Erro ao processar o depósito: ${error.message}` });
        } else {
            res.status(500).json({ error: 'Erro desconhecido ao processar o depósito.' });
        }
    }
};

router.post('/addFunds', handleAddFunds);

export default router;

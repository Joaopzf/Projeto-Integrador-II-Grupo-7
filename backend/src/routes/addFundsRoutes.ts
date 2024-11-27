// Importa as dependencias necessarias do express
import express, { Request, Response, Router } from 'express';
// Importa a função addFunds, que vai lidar com a lógica de adicionar fundos
import { addFunds } from '../services/addFunds'; 


// Criando uma instância do Router do Express para definir as rotas
const router: Router = express.Router();

// Função responsável por lidar com a requisição de adicionar fundos à conta do usuário
const handleAddFunds = async (req: Request, res: Response): Promise<void> => {
    try {
        // Desestruturando os dados da requisição
        const { userId, amount, bankDetails } = req.body;

        // Verificação de dados obrigatórios
        // Se faltar algum campo essencial (userId, amount ou bankDetails), retorna um erro 400
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

        // Chama a função addFunds para processar o depósito com os dados fornecidos
        const message = await addFunds(userId, amount, bankDetails);

        // Retorna uma resposta com o status 200 caso o depósito seja processado com sucesso
        res.status(200).json({ message });
    } catch (error) {
        // Tratamento de erro, se algum erro ocorrer durante o processo
        if (error instanceof Error) {
            // Se o erro for uma instância da classe Error, retorna o erro com a mensagem
            res.status(500).json({ error: `Erro ao processar o depósito: ${error.message}` });
        } else {
             // Para outros erros desconhecidos, retorna uma mensagem genérica
            res.status(500).json({ error: 'Erro desconhecido ao processar o depósito.' });
        }
    }
};

// Definindo a rota POST para a funcionalidade de adicionar fundos
router.post('/addFunds', handleAddFunds);

// Exportando o roteador para ser utilizado em outros módulos
export default router;

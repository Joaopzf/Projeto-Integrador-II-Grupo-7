// Importações necessárias
import express, { Request, Response, Router } from "express"; // Framework Express para gerenciar rotas HTTP
import { withdrawFundsWithTax } from "../services/withdrawFunds"; // Função de serviço que realiza a lógica de saque

// Criação de um roteador para agrupar rotas relacionadas a saques
const router: Router = express.Router();

// Função que lida com a requisição de saque
const handleWithdraw = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extrai os dados do corpo da requisição
    const { userId, amount, bankDetails } = req.body;

    // Verifica se os campos obrigatórios estão presentes
    if (!userId || !amount || !bankDetails) {
      res.status(400).json({
        error: "Campos obrigatórios ausentes: userId, amount, ou bankDetails.",
      });
      return; // Interrompe a execução se algum campo obrigatório estiver faltando
    }

    // Validação para garantir que o valor a ser sacado seja positivo
    if (amount <= 0) {
      res.status(400).json({ error: "O valor do saque deve ser maior que zero." });
      return; // Interrompe a execução se o valor for inválido
    }

    // Validação para garantir que as informações bancárias estejam corretas
    if (!bankDetails.bank_name && !bankDetails.pix_key) {
      res.status(400).json({
        error: "Informe pelo menos um método de recebimento: banco ou chave PIX.",
      });
      return; // Interrompe a execução se nenhuma opção válida for fornecida
    }

    // Chama o serviço para processar o saque
    const message = await withdrawFundsWithTax(userId, amount, bankDetails);

    // Retorna uma resposta de sucesso com o status 200
    res.status(200).json({ message });
  } catch (error) {
    // Tratamento de erros
    if (error instanceof Error) {
      res.status(500).json({ error: `Erro ao processar o saque: ${error.message}` });
    } else {
      res.status(500).json({ error: "Erro desconhecido ao processar o saque." });
    }
  }
};

// Define a rota POST no endpoint "/withdraw" para processar saques
router.post("/withdraw", handleWithdraw);

// Exporta o roteador para ser utilizado no servidor principal
export default router;

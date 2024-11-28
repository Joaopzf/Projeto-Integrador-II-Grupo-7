import express from "express";
import { getTransactions } from "../services/transactions";

const router = express.Router();

// Rota para buscar transações de um usuário
router.get("/transactions/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const transactions = await getTransactions(userId);
    res.json(transactions); // Retorna o histórico de transações em formato JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error instanceof Error ? error.message : "Erro ao obter transações." });
  }
});

export default router;

import pool from "../db/mysql";

export interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  transaction_type: 'deposito' | 'retirada';
  created_at: string;
}

export const getTransactions = async (
  userId: number // ID do usuário para filtrar as transações
): Promise<Transaction[]> => {
  try {
    console.log(`Buscando transações para o usuário ${userId}.`);

    // Consulta para obter as transações do usuário, ordenadas pela data
    const [rows]: any = await pool.execute(
      "SELECT id, user_id, amount, transaction_type, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    const transactions: Transaction[] = rows;

    console.log("Transações encontradas:", transactions);

    if (transactions.length === 0) {
      throw new Error("Nenhuma transação encontrada para este usuário.");
    }

    // Retorna a lista de transações
    return transactions;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error(`Erro ao obter transações: ${error.message}`);
    } else {
      throw new Error("Erro desconhecido ao obter transações.");
    }
  }
};

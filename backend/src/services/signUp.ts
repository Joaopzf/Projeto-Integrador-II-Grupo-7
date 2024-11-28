import pool from "../db/mysql"; 
import { User, CreditCard } from "../models/signUp"; 

export const createUser = async (
  user: User,  
  initialWalletBalance?: number,  
  creditCard?: CreditCard  
): Promise<{userId : number} > => {
  try {
    // Verificação dos campos obrigatórios e verificação do e-mail

    const [rows]: any = await pool.execute(
      "SELECT COUNT(*) AS count FROM users WHERE email = ?",
      [user.email]
    );
    const count = rows[0]?.count || 0;

    if (count > 0) {
      throw new Error("E-mail já cadastrado. Por favor, realize o login.");
    }

    // Insere o novo usuário no banco de dados
    await pool.execute(
      "INSERT INTO users (username, email, password, date_of_birth) VALUES (?, ?, ?, ?)",
      [user.username, user.email, user.password, user.date_of_birth]
    );

    const [newUserRows]: any = await pool.execute(
      "SELECT LAST_INSERT_ID() AS id"
    );
    const newUserId = newUserRows[0]?.id; // Verifique se o ID está correto.
    
    if (!newUserId) {
      throw new Error("Falha ao obter o ID do novo usuário.");
    }
    
    // Insere a carteira com saldo inicial de 0
    await pool.execute(
      "INSERT INTO wallets (user_id, balance) VALUES (?, ?)",
      [newUserId, 0]
    );

    // Se o saldo inicial for fornecido, atualiza a carteira
    if (initialWalletBalance !== undefined && creditCard) {
      await pool.execute(
        "UPDATE wallets SET balance = ? WHERE user_id = ?",
        [initialWalletBalance, newUserId]
      );
    }

    // Retorna o newUserId na resposta para o frontend
    return { userId: newUserId };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erro ao criar usuário:", error.message);
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    } else {
      console.error("Erro desconhecido ao criar usuário.");
      throw new Error("Erro desconhecido ao criar usuário.");
    }
  }
};

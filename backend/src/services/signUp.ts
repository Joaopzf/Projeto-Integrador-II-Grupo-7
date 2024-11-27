import pool from "../db/mysql"; 
import { User, CreditCard } from "../models/signUp"; 

// Função para criar um novo usuário, com opção de saldo inicial e cartão de crédito
export const createUser = async (
  user: User,  // Dados do usuário
  initialWalletBalance?: number,  // Saldo inicial da carteira 
  creditCard?: CreditCard  // Cartão de crédito 
): Promise<void> => {
  try {
    // Verificação dos campos obrigatórios
    if (!user.username || typeof user.username !== 'string') {
      throw new Error("O campo 'username' é obrigatório.");
    }
    if (!user.email || typeof user.email !== 'string') {
      throw new Error("O campo 'email' é obrigatório.");
    }
    if (!user.password || typeof user.password !== 'string') {
      throw new Error("O campo 'password' é obrigatório.");
    }
    
    // Verifica se o e-mail já está cadastrado no banco de dados
    const [rows]: any = await pool.execute(
      "SELECT COUNT(*) AS count FROM users WHERE email = ?",
      [user.email]
    );
    const count = rows[0]?.count || 0;

    if (count > 0) {
      throw new Error("E-mail já cadastrado. Por favor, realize o login.");
    }

    // Caso o campo 'date_of_birth' seja fornecido, ele será utilizado, senão será nulo
    const dateOfBirth = user.date_of_birth ? user.date_of_birth : null;

    // Insere o novo usuário no banco de dados
    await pool.execute(
      "INSERT INTO users (username, email, password, date_of_birth) VALUES (?, ?, ?, ?)",
      [user.username, user.email, user.password, dateOfBirth]
    );

    // Obtém o ID do novo usuário inserido
    const [newUserRows]: any = await pool.execute(
      "SELECT LAST_INSERT_ID() AS id"
    );
    const newUserId = newUserRows[0].id;

    // Cria a carteira para o novo usuário com saldo inicial de 0
    await pool.execute(
      "INSERT INTO wallets (user_id, balance) VALUES (?, ?)",
      [newUserId, 0]
    );

    // Se o saldo inicial for fornecido e um cartão de crédito válido for passado, atualiza a carteira
    if (initialWalletBalance !== undefined && creditCard) {
      await pool.execute(
        "UPDATE wallets SET balance = ? WHERE user_id = ?",
        [initialWalletBalance, newUserId]
      );
    }

    // Confirmação de sucesso na criação do usuário
    console.log(`Usuário ${user.username} criado com sucesso.`);
  } catch (error) {
    // Caso ocorra um erro, captura a mensagem do erro e lança uma exceção
    if (error instanceof Error) {
      console.error(error.message);  // Log da mensagem de erro
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    } else {
      throw new Error("Erro desconhecido ao criar usuário.");
    }
  }
};

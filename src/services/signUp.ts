import pool from "../db/mysql"; // Importando a conexão com o banco de dados
import { User, CreditCard } from "../models/signUp"; 

export const createUser = async (
  user: User, 
  initialWalletBalance?: number, 
  creditCard?: CreditCard
): Promise<void> => {
  try {
    // Verifica se os campos obrigatórios estão presentes
    if (!user.username || !user.email || !user.password) {
      throw new Error("Campos obrigatórios faltando.");
    }

    // Verificação se o e-mail já existe
    const [rows]: any = await pool.execute(
      "SELECT COUNT(*) AS count FROM users WHERE email = ?",
      [user.email]
    );
    const count = rows[0]?.count || 0;

    if (count > 0) {
      throw new Error("E-mail já cadastrado. Por favor, realize o login.");
    }

    // Tratamento do campo date_of_birth
    const dateOfBirth = user.date_of_birth ? user.date_of_birth : null;

    // Inserção do novo usuário
    await pool.execute(
      "INSERT INTO users (username, email, password, date_of_birth) VALUES (?, ?, ?, ?)",
      [user.username, user.email, user.password, dateOfBirth]
    );

    // Pegar o ID do usuário recém-criado
    const [newUserRows]: any = await pool.execute(
      "SELECT LAST_INSERT_ID() AS id"
    );
    const newUserId = newUserRows[0].id;

    // Criar uma nova carteira para o usuário
    await pool.execute(
      "INSERT INTO wallets (user_id, balance) VALUES (?, ?)",
      [newUserId, 0] // Cria a carteira com saldo inicial de 0
    );

    // Se o saldo inicial for fornecido e um cartão de crédito válido for fornecido, insira na tabela wallets
    if (initialWalletBalance !== undefined && creditCard) {
      await pool.execute(
        "UPDATE wallets SET balance = ? WHERE user_id = ?",
        [initialWalletBalance, newUserId]
      );
    }

    console.log(`Usuário ${user.username} criado com sucesso.`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    } else {
      throw new Error("Erro desconhecido ao criar usuário.");
    }
  }
};

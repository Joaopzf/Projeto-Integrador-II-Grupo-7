import pool from "../db/mysql"; // Importando a conexão com o banco de dados
import { Login } from "../models/login"; // Importando o modelo de Login

// Função para realizar o login do usuário
export const loginUser = async (
  loginData: Login
): Promise<{ token: string }> => {
  const { email, password } = loginData;  // Desestruturando os dados de login

  console.log("Dados recebidos para login:", loginData); // Log dos dados recebidos

  try {
    // Verifica se o usuário existe no banco de dados
    const [rows]: any = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const user = rows[0];  // Obtém o primeiro usuário encontrado

    if (!user) {
      throw new Error("Usuário não encontrado.");  // Se o usuário não existe, envia erro
    }

    // Verifica se a senha fornecida é correta
    if (user.password !== password) {
      throw new Error("Senha incorreta.");  // Se a senha não corresponde, envia erro
    }

    // Gera um token aleatório de 32 caracteres
    const token = generateRandomToken();

    // Atualiza o token gerado na tabela 'users'
    await pool.execute("UPDATE users SET token = ? WHERE email = ?", [
      token,
      email,
    ]);

    // Retorna o token gerado
    return { token };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Erro: " + error.message);  // Manda o erro com a mensagem apropriada
    } else {
      throw new Error("Erro desconhecido.");  // Caso contrário, lança erro genérico
    }
  }
};

// Função para gerar um token aleatório de 32 caracteres
function generateRandomToken(length: number = 32): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // Caracteres possíveis no token
  let token = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);  // Escolhe um índice aleatório
    token += characters[randomIndex];  // Adiciona o caractere correspondente ao token
  }
  return token;  // Retorna o token gerado
}

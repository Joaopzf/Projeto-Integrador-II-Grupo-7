import pool from "../db/mysql"; // Conexão com o banco de dados
import { Login } from "../models/login"; // Modelo de Login
import jwt from 'jsonwebtoken'; // Biblioteca JWT

const JWT_SECRET = 'projetointegrador'; // Chave secreta para gerar o token

export const loginUser = async (loginData: Login): Promise<{ token: string }> => {
  const { email, password } = loginData;

  console.log("Dados recebidos para login:", loginData);

  try {
    // Verifica se o usuário existe no banco
    const [rows]: any = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

    if (!user) {
      console.error("Usuário não encontrado.");
      throw new Error("Usuário não encontrado.");
    }

    // Verifica se a senha fornecida corresponde à do banco
    if (user.password !== password) {
      console.error("Senha incorreta.");
      throw new Error("Senha incorreta.");
    }

    // Gera o token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '8h', // Define o tempo de expiração do token
    });
    console.log("Token gerado com sucesso:", token);

    // Atualiza o token no banco de dados
    const result = await pool.execute("UPDATE users SET token = ? WHERE email = ?", [token, email]);
    console.log("Resultado da atualização do token no banco:", result);

    // Retorna o token ao frontend
    return { token };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erro ao processar login:", error.message);
      throw new Error("Erro: " + error.message);
    } else {
      console.error("Erro desconhecido ao processar login.");
      throw new Error("Erro desconhecido.");
    }
  }
};

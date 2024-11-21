"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const mysql_1 = __importDefault(require("../db/mysql")); // Importando a conexão com o banco de dados
const loginUser = async (loginData) => {
    const { email, password } = loginData;
    try {
        // Verifica se o usuário existe
        const [rows] = await mysql_1.default.execute("SELECT * FROM users WHERE email = ?", [email]);
        const user = rows[0];
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }
        if (user.password !== password) {
            throw new Error("Senha incorreta.");
        }
        // Gera um token aleatório de 32 caracteres
        const token = generateRandomToken();
        // Atualiza o token na tabela 'users'
        await mysql_1.default.execute("UPDATE users SET token = ? WHERE email = ?", [
            token,
            email,
        ]);
        return { token };
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error("Erro: " + error.message);
        }
        else {
            throw new Error("Erro desconhecido.");
        }
    }
};
exports.loginUser = loginUser;
// Função para gerar um token aleatório de 32 caracteres
function generateRandomToken(length = 32) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters[randomIndex];
    }
    return token;
}

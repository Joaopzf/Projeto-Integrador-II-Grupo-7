"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const mysql_1 = __importDefault(require("../db/mysql")); // Importando a conexão com o banco de dados
const createUser = async (user, initialWalletBalance, creditCard) => {
    try {
        // Verifica se os campos obrigatórios estão presentes
        if (!user.username || !user.email || !user.password) {
            throw new Error("Campos obrigatórios faltando.");
        }
        // Verificação se o e-mail já existe
        const [rows] = await mysql_1.default.execute("SELECT COUNT(*) AS count FROM users WHERE email = ?", [user.email]);
        const count = rows[0]?.count || 0;
        if (count > 0) {
            throw new Error("E-mail já cadastrado. Por favor, realize o login.");
        }
        // Tratamento do campo date_of_birth
        const dateOfBirth = user.date_of_birth ? user.date_of_birth : null;
        // Inserção do novo usuário
        await mysql_1.default.execute("INSERT INTO users (username, email, password, date_of_birth) VALUES (?, ?, ?, ?)", [user.username, user.email, user.password, dateOfBirth]);
        // Pegar o ID do usuário recém-criado
        const [newUserRows] = await mysql_1.default.execute("SELECT LAST_INSERT_ID() AS id");
        const newUserId = newUserRows[0].id;
        // Criar uma nova carteira para o usuário
        await mysql_1.default.execute("INSERT INTO wallets (user_id, balance) VALUES (?, ?)", [newUserId, 0] // Cria a carteira com saldo inicial de 0
        );
        // Se o saldo inicial for fornecido e um cartão de crédito válido for fornecido, insira na tabela wallets
        if (initialWalletBalance !== undefined && creditCard) {
            await mysql_1.default.execute("UPDATE wallets SET balance = ? WHERE user_id = ?", [initialWalletBalance, newUserId]);
        }
        console.log(`Usuário ${user.username} criado com sucesso.`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            throw new Error(`Erro ao criar usuário: ${error.message}`);
        }
        else {
            throw new Error("Erro desconhecido ao criar usuário.");
        }
    }
};
exports.createUser = createUser;

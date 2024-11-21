"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFunds = void 0;
const mysql_1 = __importDefault(require("../db/mysql"));
const addFunds = async (userId, amount, bankDetails) => {
    try {
        console.log(`Tentando adicionar R$ ${amount} à carteira do usuário ${userId}.`);
        // Verifica se a carteira do usuário existe
        const [rows] = await mysql_1.default.execute("SELECT * FROM wallets WHERE user_id = ?", [userId]);
        const walletRow = rows[0];
        if (!walletRow) {
            throw new Error("Carteira não encontrada.");
        }
        // Verifica se pelo menos os dados bancários ou a chave PIX foram fornecidos
        const hasBankDetails = bankDetails.bank_name && bankDetails.agency_number && bankDetails.account_number;
        const hasPixKey = bankDetails.pix_key;
        if (!hasBankDetails && !hasPixKey) {
            throw new Error("É necessário fornecer dados bancários ou uma chave PIX.");
        }
        // Verifica se todos os detalhes bancários estão presentes se eles forem fornecidos
        if (hasBankDetails && (!bankDetails.bank_name || !bankDetails.agency_number || !bankDetails.account_number)) {
            throw new Error("Informe todos os detalhes bancários: bank_name, agency_number e account_number.");
        }
        // Converte o saldo atual para número antes de adicionar
        const currentBalance = parseFloat(walletRow.balance);
        const newBalance = currentBalance + amount;
        await mysql_1.default.execute("UPDATE wallets SET balance = ? WHERE user_id = ?", [
            newBalance,
            userId,
        ]);
        // Atualiza os detalhes bancários na tabela wallets apenas se fornecidos
        if (hasBankDetails) {
            await mysql_1.default.execute("UPDATE wallets SET bank_name = ?, agency_number = ?, account_number = ? WHERE user_id = ?", [
                bankDetails.bank_name,
                bankDetails.agency_number,
                bankDetails.account_number,
                userId,
            ]);
        }
        // Atualiza a chave PIX se fornecida
        if (hasPixKey) {
            await mysql_1.default.execute("UPDATE wallets SET pix_key = ? WHERE user_id = ?", [
                bankDetails.pix_key,
                userId,
            ]);
        }
        // Registra a transação na tabela de transações
        await mysql_1.default.execute("INSERT INTO transactions (user_id, amount, transaction_type) VALUES (?, ?, ?)", [userId, amount, "depósito"]);
        return `Depósito de R$ ${amount} realizado com sucesso. Saldo atual: R$ ${newBalance}.`;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message); // Log da mensagem de erro
            throw new Error(`Erro ao processar o depósito: ${error.message}`);
        }
        else {
            throw new Error("Erro desconhecido ao processar o depósito.");
        }
    }
};
exports.addFunds = addFunds;

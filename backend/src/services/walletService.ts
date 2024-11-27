import pool from '../db/mysql'; 
import { Wallet } from '../models/wallets'; 

// Enum para tipos de transação
enum TransactionType {
    DEPOSITO = 'deposito',
    RETIRADA = 'retirada'
}

// Função para registrar uma transação
async function recordTransaction(userId: number, amount: number, transactionType: TransactionType): Promise<void> {
    await pool.query('INSERT INTO transactions (user_id, amount, transaction_type) VALUES (?, ?, ?)', [userId, amount, transactionType]);
}

// Função para obter a carteira pelo ID do usuário
async function getWalletById(userId: number): Promise<Wallet | null> {
    const [results] = await pool.query('SELECT * FROM wallets WHERE user_id = ?', [userId]);
    
    const rows = results as Wallet[]; 
    
    return rows[0] || null; 
}

// Função para atualizar o saldo da carteira
async function updateWalletBalance(userId: number, amount: number, transactionType: TransactionType): Promise<Wallet | null> {
    const wallet = await getWalletById(userId);
    if (!wallet) {
        throw new Error('Carteira não encontrada');
    }

    // Verifica se a retirada não excede o saldo
    if (transactionType === TransactionType.RETIRADA && wallet.balance + amount < 0) {
        throw new Error('Saldo insuficiente para retirada');
    }

    const newBalance = wallet.balance + amount;
    await pool.query('UPDATE wallets SET balance = ? WHERE user_id = ?', [newBalance, userId]);
    await recordTransaction(userId, amount, transactionType); // Registra a transação

    return getWalletById(userId);
}

export { getWalletById, updateWalletBalance, TransactionType };
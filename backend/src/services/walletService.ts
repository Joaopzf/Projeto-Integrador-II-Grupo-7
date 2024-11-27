import pool from '../db/mysql'; 
import { Wallet } from '../models/wallets'; 

// Função para registrar uma transação
async function recordTransaction(userId: number, amount: number, transactionType: 'deposito' | 'retirada'): Promise<void> {
    await pool.query('INSERT INTO transactions (user_id, amount, transaction_type) VALUES (?, ?, ?)', [userId, amount, transactionType]);
}

// Função para obter a carteira pelo ID do usuário
async function getWalletById(userId: number): Promise<Wallet | null> {
    const [results] = await pool.query('SELECT * FROM wallets WHERE user_id = ?', [userId]);
    
    const rows = results as Wallet[]; 
    
    return rows[0] || null; 
}

// Função para atualizar o saldo da carteira
async function updateWalletBalance(userId: number, amount: number, transactionType: 'deposito' | 'retirada'): Promise<Wallet | null> {
    const wallet = await getWalletById(userId);
    if (!wallet) {
        throw new Error('Wallet not found');
    }

    // Verifica se a retirada não excede o saldo
    if (transactionType === 'retirada' && wallet.balance + amount < 0) {
        throw new Error('Insufficient balance for withdrawal');
    }

    const newBalance = wallet.balance + amount;
    await pool.query('UPDATE wallets SET balance = ? WHERE user_id = ?', [newBalance, userId]);
    await recordTransaction(userId, amount, transactionType); // Registra a transação

    return getWalletById(userId);
}

export { getWalletById, updateWalletBalance };
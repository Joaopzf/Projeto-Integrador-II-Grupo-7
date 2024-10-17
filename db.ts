import mysql from 'mysql2/promise';

// Criação da conexão com o banco de dados
export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Priscila@2024!',
  database: 'apostas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

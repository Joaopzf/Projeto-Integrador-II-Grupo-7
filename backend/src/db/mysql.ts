// importação de bibliotecas
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// criação do pool de conexões, que gerencia as conexões com o banco de dados
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Priscila@2024!',
  database: 'apostas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// exporta o pool de conexões para ser usado em outras partes do código
export default pool;

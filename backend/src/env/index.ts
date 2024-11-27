import "dotenv/config";

// criação de um objeto "env" que vai armazenar as variáveis de ambiente necessárias para a configuração da aplicação
export const env = {
  PORT: process.env.PORT || 3000,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
};

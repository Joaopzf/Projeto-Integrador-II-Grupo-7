import pool from "../db/mysql";  // Importando a conexão com o banco de dados
// Função para buscar eventos no banco de dados com base em uma palavra-chave
export const searchEvents = async (keyword: string): Promise<any[]> => {
  try {
    // Executa a consulta SQL para buscar eventos que contêm a palavra-chave no nome
    const [rows]: any = await pool.execute(
      "SELECT * FROM events WHERE name LIKE ?",
      [`%${keyword}%`]  // A palavra chave é utilizada para buscar eventos com nomes semelhantes
    );
    return rows;  // Retorna a lista de eventos encontrados
  } catch (error) {
    // Caso ocorra um erro, captura o erro e manda uma mensagem apropriada
    if (error instanceof Error) {
      throw new Error("Erro ao buscar eventos: " + error.message);
    } else {
      throw new Error("Erro desconhecido ao buscar eventos.");
    }
  }
};

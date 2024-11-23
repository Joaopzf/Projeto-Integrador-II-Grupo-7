import pool from "../db/mysql";

export const searchEvents = async (keyword: string): Promise<any[]> => {
  try {
    const [rows]: any = await pool.execute(
      "SELECT * FROM events WHERE name LIKE ?",
      [`%${keyword}%`] // Busca por eventos cujo nome contém a palavra-chave
    );
    return rows;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Erro ao buscar eventos: " + error.message);
    } else {
      throw new Error("Erro desconhecido ao buscar eventos.");
    }
  }
};

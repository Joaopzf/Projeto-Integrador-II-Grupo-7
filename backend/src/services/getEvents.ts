import pool from '../db/mysql';  // Certifique-se de importar a conexão corretamente

export const getEventsFromDatabase = async (search: string) => {
  try {
    const query = `SELECT id, name, date, description, status FROM events WHERE name LIKE ?`;
    const [rows] = await pool.execute(query, [`%${search}%`]);

    // Agora rows já é um array de objetos, então podemos mapear diretamente
    const events = (rows as Array<any>).map((event) => ({
      id: event.id,
      name: event.name,
      date: event.date,
      description: event.description,
      status: event.status,
    }));

    return events;
  } catch (error) {
    console.error("Erro ao buscar eventos no banco:", error);
    throw error;
  }
};

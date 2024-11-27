import pool from '../db/mysql'; 

export const getEventsFromDatabase = async (search: string) => {
  try {
    const query = `SELECT id, name, date, description, status FROM events WHERE name LIKE ? AND status = 'approved'`;
    const [rows] = await pool.execute(query, [`%${search}%`]);

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

import pool from '../db/mysql'; 

// Função para buscar eventos no banco de dados com base em uma pesquisa pelo nome
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

    // Retorna a lista de eventos encontrados
    return events;
  } catch (error) {
    console.error("Erro ao buscar eventos no banco:", error);  // Exibe erro caso ocorra
    throw error;  // Lança o erro para ser tratado em outro lugar
  }
};

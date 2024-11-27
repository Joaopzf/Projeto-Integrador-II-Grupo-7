import pool from '../db/mysql';  // Certifique-se de importar a conexão corretamente

// Função para buscar eventos no banco de dados com base em uma pesquisa pelo nome
export const getEventsFromDatabase = async (search: string) => {
  try {
    // Consulta SQL para buscar eventos com o nome semelhante ao 'search'
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

    // Retorna a lista de eventos encontrados
    return events;
  } catch (error) {
    console.error("Erro ao buscar eventos no banco:", error);  // Exibe erro caso ocorra
    throw error;  // Lança o erro para ser tratado em outro lugar
  }
};

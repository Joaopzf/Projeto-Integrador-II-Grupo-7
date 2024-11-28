import pool from '../db/mysql';

export const addNewEvent = async (eventData: {
  name: string;
  description: string;
  quota: number;
  betStartDate: string;
  betEndDate: string;
  eventDate: string;
  createdBy: number;
}) => {
  const { name, description, quota, betStartDate, betEndDate, eventDate, createdBy } = eventData;

  // Validação de cota mínima
  if (quota < 1) {
    throw new Error('O valor mínimo de cada cota deve ser R$ 1,00.');
  }

  // Validação de datas
  const now = new Date();
  if (new Date(betStartDate) <= now) {
    throw new Error('A data de início das apostas deve ser no futuro.');
  }
  if (new Date(betEndDate) <= new Date(betStartDate)) {
    throw new Error('A data de fim das apostas deve ser após a data de início.');
  }
  if (new Date(eventDate) <= new Date(betEndDate)) {
    throw new Error('A data do evento deve ser após a data de fim das apostas.');
  }

  const query = `
    INSERT INTO events (name, description, quota, bet_start_date, bet_end_date, date, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // O resultado de pool.execute é um array: [QueryResult, FieldPacket[]]
  const [result] = await pool.execute(query, [
    name,
    description,
    quota,
    betStartDate,
    betEndDate,
    eventDate,
    createdBy,
  ]) as [import('mysql2').ResultSetHeader, any[]]; // Especificando o tipo correto para o retorno

  return {
    message: 'Evento criado com sucesso!',
    eventId: result.insertId, 
  };
};

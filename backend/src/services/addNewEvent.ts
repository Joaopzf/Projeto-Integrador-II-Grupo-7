import pool from "../db/mysql"; // Importando a conexão com o banco de dados
import { Event } from "../models/addEvent"; // Importando o modelo de Event

export const addNewEvent = async (
  eventData: Event
): Promise<{ message: string; eventId: number }> => {
  const { name, description, date, createdBy } = eventData; // Desestruturando os dados do evento

  try {
    // Insere um novo evento na tabela 'events'
    const [result]: any = await pool.execute(
      "INSERT INTO events (name, description, date, created_by, status) VALUES (?, ?, ?, ?, ?)",
      [name, description, date, createdBy, "pending"] // Insere os dados do evento com status 'pending'
    );

    const eventId = result.insertId; // Obtém o ID do evento recém-criado

    // Retorna uma mensagem de sucesso e o ID do evento
    return {
      message: "Evento criado com sucesso e aguardando aprovação.",
      eventId,
    };
  } catch (error: unknown) {
    // Se ocorrer um erro, lança uma nova exceção com a mensagem de erro
    if (error instanceof Error) {
      throw new Error("Erro ao criar o evento: " + error.message);
    } else {
      throw new Error("Erro desconhecido ao criar o evento.");
    }
  }
};

import pool from "../db/mysql"; // Importando o pool de conexão

export const deleteEvent = async (
  eventId: number,
  userId: number
): Promise<string> => {
  try {
    // Verifica se o evento existe, se foi criado pelo usuário e se está no status 'pending'
    const [eventRows]: any = await pool.execute(
      "SELECT * FROM events WHERE id = ? AND created_by = ? AND status = ?",
      [eventId, userId, "pending"]
    );
    const eventRow = eventRows[0];

    // Se o evento não foi encontrado ou não está no status 'pending', lança erro
    if (!eventRow) {
      throw new Error(
        'Evento não encontrado ou não pode ser removido (deve estar em status "pending" e ser de sua autoria).'
      );
    }

    // Verifica se existem apostas associadas ao evento
    const [betRows]: any = await pool.execute(
      "SELECT * FROM bets WHERE event_id = ?",
      [eventId]
    );

    // Se o evento já possui apostas, não é possível removê-lo
    if (betRows.length > 0) {
      throw new Error(
        "Não é possível remover o evento, pois ele já possui apostas."
      );
    }

    // Atualiza o status do evento para 'deleted', indicando que foi removido
    await pool.execute("UPDATE events SET status = ? WHERE id = ?", [
      "deleted",
      eventId,
    ]);

    // Retorna mensagem de sucesso
    return "Evento removido com sucesso.";
  } catch (error) {
    // Se ocorrer erro, loga a mensagem e lança um erro específico
    if (error instanceof Error) {
      console.error(error.message); // Log da mensagem de erro
      throw new Error(`Erro ao remover o evento: ${error.message}`);
    } else {
      // Caso erro desconhecido ocorra
      throw new Error("Erro desconhecido ao remover o evento.");
    }
  }
};

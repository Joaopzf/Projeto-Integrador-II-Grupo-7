import pool from "../db/mysql"; // Importando o pool de conexão

export const betOnEvent = async (
  email: string, 
  eventId: number, 
  betAmount: number 
): Promise<string> => {
  try {
    // Verifica se o apostador existe na tabela 'users' com base no email
    const [userRows]: any = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const user = userRows[0]; // Pega o primeiro usuário encontrado

    if (!user) {
      throw new Error("Apostador não encontrado."); // Mensagem caso o apostador não seja encontrado
    }

    // Verifica se o evento existe e está aprovado para apostas
    const [eventRows]: any = await pool.execute(
      "SELECT * FROM events WHERE id = ? AND status = ?",
      [eventId, "approved"]
    );
    const event = eventRows[0]; // Pega o primeiro evento encontrado

    if (!event) {
      throw new Error("Evento não encontrado ou não está disponível para apostas."); // Mensagem caso evento não esteja disponivel para aposta ou nõa foi encontrado
    }

    // Verifica o saldo do usuário na tabela 'wallets'
    const [walletRows]: any = await pool.execute(
      "SELECT balance FROM wallets WHERE user_id = ?",
      [user.id]
    );
    const wallet = walletRows[0]; // Pega o saldo da carteira do usuário

    if (!wallet || wallet.balance < betAmount) {
      throw new Error("Saldo insuficiente para realizar a aposta."); // Mensagem se o saldo for insuficiente para fazer a aposta
    }

    // Registra a aposta na tabela 'bets'
    await pool.execute(
      "INSERT INTO bets (user_id, event_id, amount) VALUES (?, ?, ?)",
      [user.id, eventId, betAmount]
    );

    // Atualiza o saldo do usuário após a aposta
    const newBalance = wallet.balance - betAmount;
    await pool.execute("UPDATE wallets SET balance = ? WHERE user_id = ?", [
      newBalance,
      user.id,
    ]);

    return "Aposta realizada com sucesso."; // Retorna uma mensagem de sucesso
  } catch (error) {
    // Tratamento de erros e log das mensagens de erro
    if (error instanceof Error) {
      console.error(error.message); // Log da mensagem de erro
      throw new Error(`Erro ao realizar a aposta: ${error.message}`);
    } else {
      throw new Error("Erro desconhecido ao realizar a aposta."); 
    }
  }
};

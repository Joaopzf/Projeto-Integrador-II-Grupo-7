import pool from "../db/mysql";  // Importando a conexão com o banco de dados

// Função para realizar o saque com a aplicação de taxas, verificando saldo, limites e detalhes bancários
export const withdrawFundsWithTax = async (
  userId: number,  
  amount: number,  
  bankDetails: any 
): Promise<string> => {
  try {
    console.log(`Tentando sacar R$ ${amount} para o usuário ${userId}.`);

    // Verifica se a carteira do usuário existe
    const [rows]: any = await pool.execute(
      "SELECT * FROM wallets WHERE user_id = ?",
      [userId]
    );
    const walletRow = rows[0];  // Obtém os dados da carteira do usuário
    if (!walletRow) {
      throw new Error("Carteira não encontrada.");
    }

    // Verifica se o valor do saque excede o limite diário
    if (amount > 101000.0) {
      console.log("Valor do saque excede o limite diário.");
      throw new Error("O valor máximo de saque por dia é de R$ 101.000,00.");
    }

    // Verifica se o saldo na carteira é suficiente para o saque
    if (walletRow.balance < amount) {
      throw new Error("Saldo insuficiente.");
    }

    // Calcula a taxa de saque com base no valor do saque
    let taxa = 0;
    if (amount <= 100) {
      taxa = amount * 0.04;  // 4% de taxa para valores até 100
    } else if (amount <= 1000) {
      taxa = amount * 0.03;  // 3% de taxa para valores até 1000
    } else if (amount <= 5000) {
      taxa = amount * 0.02;  // 2% de taxa para valores até 5000
    } else if (amount <= 100000) {
      taxa = amount * 0.01;  // 1% de taxa para valores até 100000
    }

    // Calcula o total do saque incluindo a taxa
    const totalAmount = amount + taxa;

    // Verifica se o saldo é suficiente para cobrir o saque e a taxa
    if (walletRow.balance < totalAmount) {
      throw new Error("Saldo insuficiente para cobrir o valor do saque e a taxa.");
    }

    // Atualiza o saldo da carteira após o saque
    const newBalance = walletRow.balance - totalAmount;
    await pool.execute("UPDATE wallets SET balance = ? WHERE user_id = ?", [
      newBalance,
      userId,
    ]);

    // Atualiza os detalhes bancários na tabela de wallets
    await pool.execute(
      "UPDATE wallets SET bank_name = ?, agency_number = ?, account_number = ?, pix_key = ? WHERE user_id = ?",
      [
        bankDetails.bank_name,
        bankDetails.agency_number,
        bankDetails.account_number,
        bankDetails.pix_key,
        userId,
      ]
    );

    // Registra a transação de saque na tabela de transações
    await pool.execute(
      "INSERT INTO transactions (user_id, amount, transaction_type) VALUES (?, ?, ?)",
      [userId, amount, "retirada"]
    );

    // Retorna uma mensagem de sucesso com o valor do saque, a taxa aplicada e o novo saldo
    return `Saque de R$ ${amount} realizado com sucesso. Taxa aplicada: R$ ${taxa}. Saldo atual: R$ ${newBalance}.`;
  } catch (error) {
    // Caso ocorra um erro, captura a mensagem do erro e lança uma exceção
    if (error instanceof Error) {
      console.error(error.message);  // Log da mensagem de erro
      throw new Error(`Erro ao processar o saque: ${error.message}`);
    } else {
      throw new Error("Erro desconhecido ao processar o saque.");
    }
  }
};

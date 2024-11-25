import pool from "../db/mysql";

export interface CreditCardDetails {
  card_number: string;   // Número do cartão de crédito
  expiry_date: string;   // Data de validade (MM/AA)
  cvv: string;           // Código de segurança (CVV)
}

export const addFunds = async (
  userId: number,
  amount: number,
  creditCardDetails: CreditCardDetails
): Promise<string> => {
  try {

    if (amount <= 0) {
      throw new Error("O valor do depósito deve ser maior que zero.");
    }

    console.log(
      `Tentando adicionar R$ ${amount} à carteira do usuário ${userId} utilizando cartão de crédito.`
    );

    // Verifica se a carteira do usuário existe
    const [rows]: any = await pool.execute(
      "SELECT * FROM wallets WHERE user_id = ?",
      [userId]
    );
    const walletRow = rows[0];

    if (!walletRow) {
      throw new Error("Carteira não encontrada.");
    }

    // Verifica se os dados do cartão de crédito foram fornecidos
    const hasCreditCardDetails = creditCardDetails.card_number && creditCardDetails.expiry_date && creditCardDetails.cvv;
    if (!hasCreditCardDetails) {
      throw new Error("É necessário fornecer os dados completos do cartão de crédito.");
    }

    const isValidCard = validateCreditCard(creditCardDetails);
    if (!isValidCard) {
      throw new Error("Dados do cartão de crédito inválidos.");
    }

    // Atualiza os dados do cartão de crédito na tabela 'wallets'
    await pool.execute(
      "UPDATE wallets SET card_number = ?, expiry_date = ?, cvv = ? WHERE user_id = ?",
      [
        creditCardDetails.card_number,
        creditCardDetails.expiry_date,
        creditCardDetails.cvv,
        userId,
      ]
    );

    // Converte o saldo atual para número antes de adicionar
    const currentBalance = parseFloat(walletRow.balance);
    const newBalance = currentBalance + amount;

    // Atualiza o saldo da carteira
    await pool.execute("UPDATE wallets SET balance = ? WHERE user_id = ?", [
      newBalance,
      userId,
    ]);

    // Registra a transação na tabela de transações
    await pool.execute(
      "INSERT INTO transactions (user_id, amount, transaction_type) VALUES (?, ?, ?)",
      [userId, amount, "depósito"]
    );

    return `Depósito de R$ ${amount} realizado com sucesso. Saldo atual: R$ ${newBalance}.`;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message); // Log da mensagem de erro
      throw new Error(`Erro ao processar o depósito: ${error.message}`);
    } else {
      throw new Error("Erro desconhecido ao processar o depósito.");
    }
  }
};

// Função para validar o cartão de crédito (simulação simples)
const validateCreditCard = (cardDetails: CreditCardDetails): boolean => {
  // Simulação simples: cartão válido se o número do cartão começa com '4' e a validade não passou
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Janeiro é mês 1

  const [month, year] = cardDetails.expiry_date.split('/');
  const expiryMonth = parseInt(month, 10);
  const expiryYear = parseInt(year, 10) + 2000;

  return (
    cardDetails.card_number?.startsWith('4') && 
    expiryYear >= currentYear && 
    (expiryYear > currentYear || expiryMonth >= currentMonth)
  );
};

import pool from "../db/mysql";

export interface CreditCardDetails {
  card_number: string;   // Número do cartão de crédito
  expiry_date: string;   // Data de validade (MM/AA)
  cvv: string;           // Código de segurança (CVV)
}

export const addFunds = async (
  userId: number,                        // ID do usuário
  amount: number,                        // Quantia a ser adicionada
  creditCardDetails: CreditCardDetails   // Dados do cartão de crédito
): Promise<string> => {
  try {
    // Verifica se o valor do depósito é maior que zero
    if (amount <= 0) {
      throw new Error("O valor do depósito deve ser maior que zero.");
    }

    console.log(
      `Tentando adicionar R$ ${amount} à carteira do usuário ${userId} utilizando cartão de crédito.`
    );

    // Verifica se a carteira do usuário existe no banco de dados
    const [rows]: any = await pool.execute(
      "SELECT * FROM wallets WHERE user_id = ?",
      [userId]
    );
    const walletRow = rows[0];

    if (!walletRow) {
      // Se a carteira não for encontrada, envia um erro
      throw new Error("Carteira não encontrada.");
    }

    // Verifica se todos os dados do cartão de crédito foram fornecidos
    const hasCreditCardDetails = creditCardDetails.card_number && creditCardDetails.expiry_date && creditCardDetails.cvv;
    if (!hasCreditCardDetails) {
      throw new Error("É necessário fornecer os dados completos do cartão de crédito.");
    }

    // Valida os dados do cartão de crédito
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

    // Converte o saldo atual da carteira para número
    const currentBalance = parseFloat(walletRow.balance);
    const newBalance = currentBalance + amount; // Calcula o novo saldo

    // Atualiza o saldo da carteira no banco de dados
    await pool.execute("UPDATE wallets SET balance = ? WHERE user_id = ?", [
      newBalance,
      userId,
    ]);

    // Registra a transação na tabela 'transactions'
    await pool.execute(
      "INSERT INTO transactions (user_id, amount, transaction_type) VALUES (?, ?, ?)",
      [userId, amount, "depósito"]
    );

    // Retorna mensagem de sucesso
    return `Depósito de R$ ${amount} realizado com sucesso. Saldo atual: R$ ${newBalance}.`;
  } catch (error) {
    if (error instanceof Error) {
      // Loga o erro no console e lança uma nova mensagem de erro
      console.error(error.message);
      throw new Error(`Erro ao processar o depósito: ${error.message}`);
    } else {
      throw new Error("Erro desconhecido ao processar o depósito.");
    }
  }
};

// Função para validar o cartão de crédito 
const validateCreditCard = (cardDetails: CreditCardDetails): boolean => {
  // Simula a validação verificando se o cartão começa com '4' e se a validade ainda está ativa
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; 

  const [month, year] = cardDetails.expiry_date.split('/'); 
  const expiryMonth = parseInt(month, 10);  
  const expiryYear = parseInt(year, 10) + 2000; 

  // Verifica se o cartão é válido
  return (
    cardDetails.card_number?.startsWith('4') &&  // Número do cartão começa com '4'
    expiryYear >= currentYear &&                // Ano de validade maior ou igual ao atual
    (expiryYear > currentYear || expiryMonth >= currentMonth) // Mês válido no ano corrente
  );
};

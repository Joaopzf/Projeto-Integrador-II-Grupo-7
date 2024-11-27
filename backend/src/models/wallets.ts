export interface CreditCardDetails {
  card_number: string;    // Número do cartão de crédito (obrigatório)
  expiry_date: string;    // Data de validade (MM/AA) (obrigatório)
  cvv: string;            // Código de segurança (CVV) (obrigatório)
}

// Interface para a carteira
export interface Wallet {
  id?: number;                        
  name: string;                       
  balance: number;                    
  creditCard?: CreditCardDetails;     
}
// Define a interface Transaction, que descreve a estrutura de dados para uma transação 
export interface Transaction {
    id: number;
    user_id: number;
    amount: number;
    transaction_type: 'deposito' | 'retirada';
    created_at: Date;
}

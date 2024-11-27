// Define a interface User, que descreve a estrutura de dados para um usuário
export interface User {
    id?: number; 
    username: string;
    email: string;
    password: string;
    date_of_birth?: string | null; // Pode ser null se não for fornecida
    token?: string; // Adicionando o token aqui
}

// Define a interface CreditCard, que descreve a estrutura de dados para um cartão de crédito
export interface CreditCard {
    number: string; 
    expiry: string; 
    cvv: string;    
}

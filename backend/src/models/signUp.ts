export interface User {
    id?: number; 
    username: string;
    email: string;
    password: string;
    date_of_birth?: string | null;
    token?: string; // Adicionando o token aqui
}

export interface CreditCard {
    number: string; 
    expiry: string; 
    cvv: string;    
}

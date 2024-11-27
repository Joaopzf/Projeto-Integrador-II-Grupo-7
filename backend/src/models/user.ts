// Define a interface User, que descreve a estrutura de dados para um usuário
export interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    initialWalletBalance?: number; 
}

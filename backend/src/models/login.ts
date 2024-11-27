// Define a interface Login, que descreve a estrutura de dados para o login de um usuário
export interface Login {
    email: string;     // O e-mail do usuário
    password: string;  // A senha do usuário
    token?: string; 
}

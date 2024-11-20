export interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    initialWalletBalance?: number; 
}

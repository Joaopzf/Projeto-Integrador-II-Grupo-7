import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Extensão da interface Request para incluir a propriedade user
interface CustomRequest extends Request {
    user?: any; 
}

dotenv.config();

const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        res.sendStatus(401);
        return; 
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        throw new Error('A variável de ambiente ACCESS_TOKEN_SECRET não está definida');
    }

    jwt.verify(token, secret, (err: any, user: any) => {
        if (err) {
            res.sendStatus(403); // Proibido
            return; // Interrompe a execução da função
        }
        req.user = user; // Anexar o usuário ao objeto de requisição
        next(); // Chama o próximo middleware
    });
};

export default authenticateToken;
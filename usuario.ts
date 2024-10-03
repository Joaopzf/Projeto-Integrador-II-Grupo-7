// CRIANDO AS ROTAS DO USUÁRIO
import { Router, Request, Response } from "express";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

// rotas
const router = Router();

const usuario = (banco:Connection) => {

    router.post('/signUp', (req: Request, res: Response) => {
        const { nome, email, senha } = req.body;
        banco.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senha],
            (err, result) => {
                if (err){
                    console.error('erro: ' + err.stack);
                    return res.status(400).send('Erro ao cadastrar');
                }
                res.status(201).send('Usuario cadastrado');

            }
        );
    });

    return router;
}

export default usuario;
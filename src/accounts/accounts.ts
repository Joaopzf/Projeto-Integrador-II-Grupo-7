// src/accounts.ts

import express, { Request, Response } from 'express';
import oracledb from 'oracledb';
import bodyParser from 'body-parser';

// Modelo de Usuário
export interface User {
    id?: number; 
    nome: string;
    email: string;
    senha: string;
    dataNascimento: string; 
}

// Função para criar um novo usuário
const createUser = async (user: User): Promise<void> => {
    const connection = await oracledb.getConnection();

    try {
        // Verificação se o e-mail já existe
        const result = await connection.execute(
            `SELECT COUNT(*) AS count FROM usuarios WHERE email = :email`,
            { email: user.email }
        );

        const count = result.rows && result.rows[0] ? (result.rows[0] as any)[0] : 0;

        if (count > 0) {
            throw new Error('E-mail já cadastrado');
        }

        // Inserção do novo usuário
        await connection.execute(
            `INSERT INTO usuarios (nome, email, senha, data_nascimento) 
            VALUES (:nome, :email, :senha, TO_DATE(:dataNascimento, 'YYYY-MM-DD'))`,
            {
                nome: user.nome,
                email: user.email,
                senha: user.senha,
                dataNascimento: user.dataNascimento,
            },
            { autoCommit: true }
        );
    } finally {
        await connection.close();
    }
};

const authenticateUser = async (email: string, senha: string): Promise<string> => {
    const connection = await oracledb.getConnection();

    try {
        const result = await connection.execute(
            `SELECT * FROM usuarios WHERE email = :email AND senha = :senha`,
            { email, senha }
        );

        // Verifique se result.rows existe e tem valores
        if (!result.rows || result.rows.length === 0) {
            throw new Error('Credenciais inválidas');
        }

        const user = result.rows[0] as any[];

        // Geração do token de sessão
        const tokenResult = await connection.execute(
            `SELECT dbms_random.string('x', 32) AS token FROM dual`
        );

        // Asserção de tipo adequada para tokenResult.rows como string[][]
        const rows = tokenResult.rows as unknown as string[][];

        // Verifique se tokenResult.rows existe e tem valores
        if (!rows || rows.length === 0) {
            throw new Error('Erro ao gerar o token');
        }

        // Agora o TypeScript entende corretamente que rows[0][0] é uma string
        const token = rows[0][0];

        // Atualizando o token no banco de dados
        await connection.execute(
            `UPDATE usuarios SET token = :token WHERE email = :email`,
            { token, email },
            { autoCommit: true }
        );

        return token;
    } finally {
        await connection.close();
    }
};

// Roteador do Express
const router = express.Router();

// Rota para cadastro do usuário
router.post('/signUp', async (req: Request, res: Response): Promise<void> => {
    const user: User = req.body;

    try {
        await createUser(user);
        res.status(201).send('Usuário cadastrado com sucesso');
    } catch (err: unknown) {
        console.error('Erro ao cadastrar: ', err);

        if (err instanceof Error) {
            if (err.message === 'E-mail já cadastrado') {
                res.status(409).send(err.message);
            } else {
                res.status(400).send('Erro ao cadastrar');
            }
        } else {
            res.status(500).send('Erro interno do servidor');
        }
    }
});

// Rota para login do usuário
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { email, senha } = req.body;

    try {
        const token = await authenticateUser(email, senha);
        res.status(200).json({ token });
    } catch (err: unknown) {
        console.error('Erro ao autenticar: ', err);

        if (err instanceof Error) {
            if (err.message === 'Credenciais inválidas') {
                res.status(401).send('Email ou senha incorretos');
            } else {
                res.status(400).send('Erro ao autenticar');
            }
        } else {
            res.status(500).send('Erro interno do servidor');
        }
    }
});

// Exporta o roteador
export default router;
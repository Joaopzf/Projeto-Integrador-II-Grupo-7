import express from 'express';
import { createUser } from '../services/signUp'; 
import { User } from '../models/signUp'; 

const router = express.Router();

router.post('/signup', async (req, res) => {
    const user: User = req.body;

    try {
        await createUser(user);
        res.status(201).json({ message: 'Usuário criado com sucesso.' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Erro desconhecido ao criar usuário.' });
        }
    }
});

export default router;

import express from 'express'; // Importa o framework Express para gerenciar rotas e requisições HTTP
import { createUser } from '../services/signUp'; // Importa a função de criação de usuários do serviço correspondente
import { User } from '../models/signUp'; // Importa o modelo de dados do usuário para tipagem

// Cria um roteador para agrupar as rotas relacionadas à criação de usuários
const router = express.Router();

// Define a rota POST para a criação de usuários no endpoint "/signup"
router.post('/signup', async (req, res) => {
    // Extrai os dados do corpo da requisição e os tipa como um objeto User
    const user: User = req.body;

    try {
        // Chama a função de serviço para criar o usuário no banco de dados
        await createUser(user);

        // Retorna uma resposta de sucesso com o status 201 (Criado)
        res.status(201).json({ message: 'Usuário criado com sucesso.' });
    } catch (error: unknown) {
        // Trata os possíveis erros
        if (error instanceof Error) {
            // Se o erro for conhecido, retorna um status 400 (Requisição inválida) com a mensagem do erro
            res.status(400).json({ error: error.message });
        } else {
            // Para erros não previstos, retorna um status 500 (Erro interno do servidor) com uma mensagem genérica
            res.status(500).json({ error: 'Erro desconhecido ao criar usuário.' });
        }
    }
});

// Exporta o roteador para ser usado no servidor principal
export default router;

import { Router } from 'express';
import { loginUser  } from '../services/login'; // Importa a função loginUser  do serviço responsável por autenticar o usuário
import { Login } from '../models/login'; // Importa o modelo Login para tipagem

// Cria uma instância de Router para gerenciar as rotas relacionadas ao login
const router = Router();

// Define a rota POST para "/login"
router.post('/login', async (req, res) => {
    // Obtém os dados de login enviados no corpo da requisição e os tipa como Login
    const loginData: Login = req.body;

    try {
        // Chama a função loginUser  para autenticar o usuário e retorna o token de autenticação e o userId
        const { token, userId } = await loginUser (loginData); // Certifique-se de que loginUser  retorna userId

        // Retorna uma resposta HTTP com status 200 e o token e userId gerados no formato JSON
        res.status(200).json({ token, userId }); // Inclua o userId na resposta
    } catch (error: unknown) {
        // Caso ocorra algum erro, verifica se é uma instância de Error
        if (error instanceof Error) {
            // Retorna um status 400 (Bad Request) com uma mensagem detalhada de erro
            res.status(400).json({ message: 'Erro ao fazer login: ' + error.message });
        } else {
            // Caso o erro seja desconhecido, retorna status 500 (Internal Server Error) com uma mensagem de erro
            res.status(500).json({ message: 'Erro desconhecido ao fazer login.' });
        }
    }
});

// Exporta o roteador para que ele seja utilizado em outras partes da aplicação
export default router;
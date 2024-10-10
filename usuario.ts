// O QUE SÃO ROTAS????
// IMPORTAÇÃO DE MÓDULOS ??????
import { Router, Request, Response } from "express";
// IMPORTAÇÃO DA CONEXÃO MYSQL ??????
import { Connection } from "mysql2/typings/mysql/lib/Connection";

// rotas
const router = Router();

const usuario = (banco: Connection) => {
    // ROTAS PARA CADASTRO DO USUÁRIO
    router.post('/signUp', (req: Request, res: Response) => {
        const { nome, email, senha } = req.body;
        banco.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senha],
            (err, result) => {
                if (err) {
                    console.error('Erro: ' + err.stack);
                    return res.status(400).send('Erro ao cadastrar');
                }
                res.status(201).send('Usuário cadastrado com sucesso');
            }
        );
    });

    // DELETAR USUÁRIOS 
    // CRIANDO A ROTA PARA DELETAR O USUÁRIO 
    // http://localhost:3000/deleteUsuario/ (COLOCAR O IDUSUARIO QUE EU QUERO DELETAR)
    router.delete('/deleteUsuario/:id', (req: Request, res: Response) => {
        const { id } = req.params; // extrai o valor da id e passa para a URL (ex: /deleteUsuario/5 -> se o id fosse 5)
        // EXECUTANDO COMANDO NO MYSQL PARA DELETAR O USUÁRIO
        banco.query( // executa o comando no mysql
            'DELETE FROM usuarios WHERE idusuarios = ?', // comando que deleta o usuário
            [id], // pega o id que eu quero que delete 
            // VERIFICANDO OS ERROS 
            (err, result: any) => {
                if (err) {
                    console.error('Erro: ' + err.stack);
                    return res.status(400).send('Erro ao deletar usuário');
                }

                // Acessando affectedRows diretamente
                if (result.affectedRows === 0) {
                    return res.status(404).send('Usuário não encontrado');
                }

                res.status(200).send('Usuário deletado com sucesso');
            }
        );
    });

    return router;
}

export default usuario;

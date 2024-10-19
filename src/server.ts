// src/server.ts

import express from 'express';
import oracledb from 'oracledb';
import bodyParser from 'body-parser';
import accountsRoutes from './accounts/accounts'; // Importando as rotas de conta

const app = express();
const port = 3000;

const bancoConfig = {
    user: '',
    password: '',
    connectString: ''
};

async function initOracleConnection() {
    try {
        await oracledb.createPool(bancoConfig);
        console.log("Conectado ao Oracle Database");
    } catch (err) {
        console.error('Erro ao conectar ao Oracle: ', err);
    }
}

initOracleConnection().then(() => {
    const pool = oracledb.getPool();

    if (!pool) {
        console.error('Pool do Oracle não foi inicializado');
        process.exit(1);
    }

    app.use(bodyParser.json());
    app.use('/usuario', accountsRoutes); // Usando as rotas de usuário

    app.listen(port, () => console.log(`Rodando: http://localhost:${port}`));
}).catch((err) => {
    console.error('Erro ao iniciar a aplicação:', err);
});

import express from 'express';
import mysql from 'mysql2'; 
import usuario from './usuario';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const banco = mysql.createConnection({
    host:'127.0.0.1', 
    user: 'root',
    password: '743274',
    database: 'pi' // nome do meu database -> schemas no mysql

});

banco.connect((err) => { // se der erro
    if (err) {
        console.error('erro: ' + err.stack);
        return;
    }
    console.log("conectado");
});

app.use(bodyParser.json());
app.use('/', usuario(banco));

app.listen(port, ()=> console.log(`Rodando: http://localhost:${port}`));


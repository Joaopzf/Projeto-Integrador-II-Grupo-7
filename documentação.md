## CONEXÃO COM O ORACLE 
terminal: npm run start

se não funcionar fazer esse passo a passo no terminal? 
1) sqlplus sophia/743274@localhost/XEPDB1
2) exit
3) npm run start 

## FUNÇÃO SIGNUP NO POSTMAN 
1) método: POST
2) URL: http://localhost:3000/usuario/signUp
3) Body - raw e JSON
Exemplo de Body: 
{
    "nome": "Sophia Godoy",
    "email": "sophia@gemail.com",
    "senha": "odeiopi",
    "dataNascimento": "2006-15-05"
}
4) SEND

## FUNÇÃO LOGIN NO POSTMAN 
1) método: POST 
2) URL: http://localhost:3000/usuario/login
3) Body - raw e JSON
Exemplo de Body: 
{
    "email": "sophia@gemail.com",
    "senha": "odeiopi"
}
4) SEND 
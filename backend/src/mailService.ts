import nodemailer from 'nodemailer'; // Importando a biblioteca para envio de emails
import winston from 'winston'; // Importando a biblioteca de logging
import dotenv from "dotenv"; // Importando dotenv para carregar variáveis de ambiente
dotenv.config(); // Carrega variáveis do arquivo .env

// Configuração do logger usando Winston para registrar logs
const logger = winston.createLogger({
    level: 'debug', // Define o nível de log (debug para mostrar detalhes)
    format: winston.format.json(), // Formato de log em JSON
    transports: [new winston.transports.Console()] // Exibe os logs no console
});

// Função para enviar email
export const sendMail = async (from: string, to: string, subject: string, html: string) => {
    // Criação do transporter para o envio do email
    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_HOST, // Serviço de email
        auth: {
            user: process.env.MAIL_USERNAME, // Usuário para autenticação
            pass: process.env.MAIL_PASSWORD  // Senha para autenticação
        }
    });

    // Configuração do conteúdo do email
    const mailOptions = {
        from: from,  // Remetente
        to: to,      // Destinatário
        subject: subject, // Assunto do email
        html: html    // Conteúdo HTML do email
    };

    // Log de informação antes de enviar o email
    logger.info('Enviando email para - ${to}');
    
    // Envio do email
    transporter.sendMail(mailOptions, (error, info)=> {
        if (error) {
            // Log de erro caso o envio falhe
            logger.error(error);
        } else {
            // Log de sucesso com a resposta do envio
            logger.info('Email sent: ' + info.response);
        }
    });
}

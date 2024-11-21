"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const winston_1 = __importDefault(require("winston"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const logger = winston_1.default.createLogger({
    level: 'debug',
    format: winston_1.default.format.json(),
    transports: [new winston_1.default.transports.Console()]
});
const sendMail = async (from, to, subject, html) => {
    const transporter = nodemailer_1.default.createTransport({
        service: process.env.MAIL_HOST,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: html
    };
    logger.info('Enviando email para - ${to}');
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.error(error);
        }
        else {
            logger.info('Email sent: ' + info.response);
        }
    });
};
exports.sendMail = sendMail;

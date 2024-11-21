"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewEvent = void 0;
const mysql_1 = __importDefault(require("../db/mysql")); // Importando a conexão com o banco de dados
const addNewEvent = async (eventData) => {
    const { name, description, date, createdBy } = eventData;
    try {
        // Insere um novo evento na tabela 'events'
        const [result] = await mysql_1.default.execute("INSERT INTO events (name, description, date, created_by, status) VALUES (?, ?, ?, ?, ?)", [name, description, date, createdBy, "pending"]);
        const eventId = result.insertId; // ID do evento recém-criado
        return {
            message: "Evento criado com sucesso e aguardando aprovação.",
            eventId,
        };
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error("Erro ao criar o evento: " + error.message);
        }
        else {
            throw new Error("Erro desconhecido ao criar o evento.");
        }
    }
};
exports.addNewEvent = addNewEvent;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchEvents = void 0;
const mysql_1 = __importDefault(require("../db/mysql"));
const searchEvents = async (keyword) => {
    try {
        const [rows] = await mysql_1.default.execute("SELECT * FROM events WHERE name LIKE ?", [`%${keyword}%`] // Busca por eventos cujo nome contém a palavra-chave
        );
        return rows;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error("Erro ao buscar eventos: " + error.message);
        }
        else {
            throw new Error("Erro desconhecido ao buscar eventos.");
        }
    }
};
exports.searchEvents = searchEvents;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = void 0;
const mysql_1 = __importDefault(require("../db/mysql")); // Importando o pool de conexão
const getEvents = async (status) => {
    try {
        let query = "SELECT * FROM events";
        const params = [];
        if (status) {
            query += " WHERE status = ?";
            params.push(status);
        }
        console.log(`Executando consulta: ${query} com parâmetros: ${JSON.stringify(params)}`);
        const [rows] = await mysql_1.default.execute(query, params);
        console.log(`Resultados obtidos: ${JSON.stringify(rows)}`);
        return rows;
    }
    catch (error) {
        throw new Error(`Erro ao buscar eventos: ${error.message}`);
    }
};
exports.getEvents = getEvents;

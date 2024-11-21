"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getEvents_1 = require("../services/getEvents");
const router = express_1.default.Router();
const handleGetEvents = async (req, res) => {
    try {
        const { status } = req.query; // Obtemos o status da query string
        // Limpa o status para remover espaços em branco e caracteres de nova linha
        const cleanedStatus = status ? status.trim() : undefined;
        console.log(`Buscando eventos com status: ${cleanedStatus}`); // Log para depuração
        // Chama a função para buscar eventos
        const events = await (0, getEvents_1.getEvents)(cleanedStatus);
        console.log(`Eventos encontrados: ${JSON.stringify(events)}`); // Log para depuração
        res.status(200).json(events);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `Erro ao buscar eventos: ${error.message}` });
        }
        else {
            res.status(500).json({ error: 'Erro desconhecido ao buscar eventos.' });
        }
    }
};
// Define a rota para busca de eventos
router.get('/getEvents', handleGetEvents);
exports.default = router;

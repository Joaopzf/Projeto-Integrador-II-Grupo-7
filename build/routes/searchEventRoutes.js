"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const searchEvents_1 = require("../services/searchEvents");
const router = express_1.default.Router();
const handleSearchEvent = async (req, res) => {
    try {
        const { keyword } = req.query;
        if (!keyword) {
            res.status(400).json({ error: 'Palavra-chave é obrigatória para busca.' });
            return;
        }
        const events = await (0, searchEvents_1.searchEvents)(keyword);
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
router.get('/searchEvent', handleSearchEvent);
exports.default = router;

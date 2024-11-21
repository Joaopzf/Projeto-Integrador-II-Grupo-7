"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deleteEvent_1 = require("../services/deleteEvent");
const router = express_1.default.Router();
const handleDeleteEvent = async (req, res) => {
    try {
        const { eventId, userId } = req.body;
        // Verificação de dados obrigatórios
        if (!eventId || !userId) {
            res.status(400).json({ error: 'Campos obrigatórios ausentes: eventId ou userId.' });
            return;
        }
        const message = await (0, deleteEvent_1.deleteEvent)(eventId, userId);
        res.status(200).json({ message });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `Erro ao remover o evento: ${error.message}` });
        }
        else {
            res.status(500).json({ error: 'Erro desconhecido ao remover o evento.' });
        }
    }
};
// Define a rota para remover um evento
router.post('/deleteEvent', handleDeleteEvent);
exports.default = router;

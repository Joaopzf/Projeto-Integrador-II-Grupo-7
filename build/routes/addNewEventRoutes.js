"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const addNewEvent_1 = require("../services/addNewEvent");
const router = express_1.default.Router();
const handleAddNewEvent = async (req, res) => {
    try {
        const { name, date, description, createdBy } = req.body;
        // Verificação de dados obrigatórios
        if (!name || !date || !createdBy) {
            res.status(400).json({ error: 'Campos obrigatórios ausentes: name, date ou createdBy.' });
            return;
        }
        // Chama a função para adicionar um novo evento e obter o ID do evento criado
        const { message, eventId } = await (0, addNewEvent_1.addNewEvent)({ name, date, description, createdBy });
        res.status(201).json({ message, eventId });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `Erro ao adicionar o evento: ${error.message}` });
        }
        else {
            res.status(500).json({ error: 'Erro desconhecido ao adicionar o evento.' });
        }
    }
};
// Define a rota para adicionar um novo evento
router.post('/addNewEvent', handleAddNewEvent);
exports.default = router;

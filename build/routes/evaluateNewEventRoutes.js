"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const evaluateNewEvent_1 = require("../services/evaluateNewEvent");
const router = express_1.default.Router();
const handleEvaluateEvent = async (req, res) => {
    try {
        const { eventId, moderatorId, action, reason } = req.body;
        // Verificação de dados obrigatórios
        if (!eventId || !moderatorId || !action) {
            res.status(400).json({ error: 'Campos obrigatórios ausentes: eventId, moderatorId, ou action.' });
            return;
        }
        // Validação para garantir que a ação seja válida
        const validActions = ['approve', 'reject'];
        if (!validActions.includes(action)) {
            res.status(400).json({ error: 'Ação inválida. Use "approve" ou "reject".' });
            return;
        }
        // Verificação se a razão foi fornecida para a rejeição
        if (action === 'reject' && !reason) {
            res.status(400).json({ error: 'Uma razão deve ser fornecida ao rejeitar um evento.' });
            return;
        }
        const message = await (0, evaluateNewEvent_1.evaluateNewEvent)(eventId, moderatorId, action, reason);
        res.status(200).json({ message });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `Erro ao avaliar o evento: ${error.message}` });
        }
        else {
            res.status(500).json({ error: 'Erro desconhecido ao avaliar o evento.' });
        }
    }
};
router.post('/evaluate', handleEvaluateEvent);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const finishEvent_1 = require("../services/finishEvent");
const router = express_1.default.Router();
const handleFinishEvent = async (req, res) => {
    try {
        const { event_id, result } = req.body;
        const moderatorId = Number(req.headers["moderator-id"]); // Acesso ao ID do moderador via cabeçalho
        // Verificação de dados obrigatórios
        if (!event_id || typeof event_id !== "number") {
            res.status(400).json({ error: "ID do evento inválido." });
            return; // Garantindo que a função termine aqui
        }
        if (result === undefined || result <= 0) {
            res.status(400).json({ error: "Resultado inválido." });
            return;
        }
        if (!moderatorId) {
            res.status(400).json({ error: "ID do moderador é necessário." });
            return;
        }
        const message = await (0, finishEvent_1.finishEvent)({
            eventId: event_id,
            result,
            moderatorId,
        });
        res.status(200).json({ message });
    }
    catch (error) {
        const errorMessage = error instanceof Error
            ? `Erro ao finalizar o evento: ${error.message}`
            : "Erro desconhecido ao finalizar o evento.";
        res.status(500).json({ error: errorMessage });
    }
};
router.post("/finish", handleFinishEvent);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const betOnEvent_1 = require("../services/betOnEvent");
const router = express_1.default.Router();
const handleBetOnEvent = async (req, res) => {
    try {
        const { email, eventId, betAmount } = req.body;
        // Verificação de dados obrigatórios
        if (!email || !eventId || !betAmount) {
            res
                .status(400)
                .json({
                error: "Campos obrigatórios ausentes: email, eventId ou betAmount.",
            });
            return;
        }
        const message = await (0, betOnEvent_1.betOnEvent)(email, eventId, betAmount);
        res.status(201).json({ message });
    }
    catch (error) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ error: `Erro ao realizar a aposta: ${error.message}` });
        }
        else {
            res
                .status(500)
                .json({ error: "Erro desconhecido ao realizar a aposta." });
        }
    }
};
// Define a rota para apostar em um evento
router.post("/betOnEvent", handleBetOnEvent);
exports.default = router;

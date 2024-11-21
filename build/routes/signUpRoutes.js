"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signUp_1 = require("../services/signUp");
const router = express_1.default.Router();
router.post('/signup', async (req, res) => {
    const user = req.body;
    try {
        await (0, signUp_1.createUser)(user);
        res.status(201).json({ message: 'Usuário criado com sucesso.' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Erro desconhecido ao criar usuário.' });
        }
    }
});
exports.default = router;

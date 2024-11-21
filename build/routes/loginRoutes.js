"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = require("../services/login");
const router = (0, express_1.Router)();
router.post('/login', async (req, res) => {
    const loginData = req.body;
    try {
        const { token } = await (0, login_1.loginUser)(loginData);
        res.status(200).json({ token });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Erro ao fazer login: ' + error.message });
        }
        else {
            res.status(500).json({ message: 'Erro desconhecido ao fazer login.' });
        }
    }
});
exports.default = router;

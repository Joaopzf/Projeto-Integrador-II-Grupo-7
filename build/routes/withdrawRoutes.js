"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const withdrawFunds_1 = require("../services/withdrawFunds");
const router = express_1.default.Router();
const handleWithdraw = async (req, res) => {
    try {
        const { userId, amount, bankDetails } = req.body;
        // Verificação de dados obrigatórios
        if (!userId || !amount || !bankDetails) {
            res.status(400).json({
                error: "Campos obrigatórios ausentes: userId, amount, ou bankDetails.",
            });
            return;
        }
        // Validação para garantir que o valor seja positivo
        if (amount <= 0) {
            res
                .status(400)
                .json({ error: "O valor do saque deve ser maior que zero." });
            return;
        }
        // Validação para garantir que as informações bancárias estejam corretas
        if (!bankDetails.bank_name && !bankDetails.pix_key) {
            res.status(400).json({
                error: "Informe pelo menos um método de recebimento: banco ou chave PIX.",
            });
            return;
        }
        const message = await (0, withdrawFunds_1.withdrawFundsWithTax)(userId, amount, bankDetails);
        res.status(200).json({ message });
    }
    catch (error) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ error: `Erro ao processar o saque: ${error.message}` });
        }
        else {
            res
                .status(500)
                .json({ error: "Erro desconhecido ao processar o saque." });
        }
    }
};
router.post("/withdraw", handleWithdraw);
exports.default = router;

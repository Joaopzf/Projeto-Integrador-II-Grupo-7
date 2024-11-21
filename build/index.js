"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const evaluateNewEventRoutes_1 = __importDefault(require("./routes/evaluateNewEventRoutes"));
const deleteEventRoutes_1 = __importDefault(require("./routes/deleteEventRoutes"));
const addFundsRoutes_1 = __importDefault(require("./routes/addFundsRoutes"));
const signUpRoutes_1 = __importDefault(require("./routes/signUpRoutes"));
const withdrawRoutes_1 = __importDefault(require("./routes/withdrawRoutes"));
const searchEventRoutes_1 = __importDefault(require("./routes/searchEventRoutes"));
const betOnEventRoutes_1 = __importDefault(require("./routes/betOnEventRoutes"));
const finishEventRoutes_1 = __importDefault(require("./routes/finishEventRoutes"));
const addNewEventRoutes_1 = __importDefault(require("./routes/addNewEventRoutes"));
const getEventsRoutes_1 = __importDefault(require("./routes/getEventsRoutes"));
const loginRoutes_1 = __importDefault(require("./routes/loginRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Middleware para parsear JSON
// Registrar as rotas
app.use("/api", evaluateNewEventRoutes_1.default);
app.use("/api", deleteEventRoutes_1.default);
app.use("/api", addFundsRoutes_1.default);
app.use("/api", signUpRoutes_1.default);
app.use("/api", withdrawRoutes_1.default);
app.use("/api", searchEventRoutes_1.default);
app.use("/api", betOnEventRoutes_1.default);
app.use("/api", finishEventRoutes_1.default);
app.use('/api', addNewEventRoutes_1.default);
app.use('/api', getEventsRoutes_1.default);
app.use('/api', loginRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

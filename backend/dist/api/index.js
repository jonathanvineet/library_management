"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("../src/routes/auth"));
const books_1 = __importDefault(require("../src/routes/books"));
const members_1 = __importDefault(require("../src/routes/members"));
const requests_1 = __importDefault(require("../src/routes/requests"));
const transactions_1 = __importDefault(require("../src/routes/transactions"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS configuration
const corsOptions = {
    origin: 'https://library-management-14.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
// Apply CORS to all routes
app.use((0, cors_1.default)(corsOptions));
// Handle preflight requests explicitly
app.options('*', (0, cors_1.default)(corsOptions));
// Add custom CORS headers as fallback
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://library-management-14.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use(express_1.default.json());
// Routes
app.use('/auth', auth_1.default);
app.use('/books', books_1.default);
app.use('/members', members_1.default);
app.use('/requests', requests_1.default);
app.use('/transactions', transactions_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
exports.default = app;
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_TOKEN_WEB || '';
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
}
const authMiddleware = async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return reply.code(401).send({ error: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        request.user = decoded; // Adiciona os dados do usuário à requisição
        console.log('Usuário autenticado:', decoded); // Log para depuração
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            return reply.code(401).send({ error: 'Token expired' });
        }
        return reply.code(401).send({ error: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getRegisterUser = exports.loginUser = exports.registerUser = void 0;
const prismaClient_1 = __importDefault(require("../models/prismaClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Token = process.env.JWT_TOKEN_WEB;
const registerUser = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = request.body;
        // Verifica se o usuário já existe
        const existingUser = yield prismaClient_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return reply.code(400).send({ error: 'User already exists' });
        }
        // Criptografa a senha
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Cria o usuário
        const user = yield prismaClient_1.default.user.create({
            data: { name, email, password: hashedPassword },
        });
        // Gera um token JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id }, `${Token}`, { expiresIn: '1h' });
        return reply.code(201).send({ message: 'User created successfully', token });
    }
    catch (error) {
        reply.code(500).send({ error: 'Failed to register user' });
    }
});
exports.registerUser = registerUser;
const loginUser = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = request.body;
        // Busca o usuário no banco de dados
        const user = yield prismaClient_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return reply.code(401).send({ error: 'Invalid email or password' });
        }
        // Verifica a senha
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return reply.code(401).send({ error: 'Invalid email or password' });
        }
        // Gera um token JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id }, `${Token}`, { expiresIn: '1h' });
        const authenticatedUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            token,
        };
        return reply.send(authenticatedUser);
    }
    catch (error) {
        reply.code(500).send({ error: 'Failed to log in user' });
    }
});
exports.loginUser = loginUser;
const getRegisterUser = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Pegue o ID do usuário autenticado do token decodificado
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return reply.code(401).send({ error: 'Usuário não autenticado' });
        }
        // Busque o usuário pelo ID
        const registerUser = yield prismaClient_1.default.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                fuelPrices: true, // Use o nome correto do relacionamento conforme definido no schema do Prisma
            },
        });
        if (!registerUser) {
            return reply.code(404).send({ message: 'Usuário não encontrado!' });
        }
        reply.code(200).send(registerUser);
    }
    catch (error) {
        console.error('Erro ao buscar usuário:', error);
        reply.code(500).send({ error: 'Erro ao buscar dados do usuário' });
    }
});
exports.getRegisterUser = getRegisterUser;
const deleteUser = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return reply.status(401).send({ error: 'Token de autenticação não encontrado.' });
        }
        if (!Token) {
            return reply.status(500).send({ error: 'Token de autenticação não configurado.' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, Token);
        if (!decoded || !decoded.id) {
            return reply.status(401).send({ error: 'Token inválido ou usuário não autenticado.' });
        }
        const userId = decoded.id;
        // Verifica se o usuário existe
        const user = yield prismaClient_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return reply.status(404).send({ error: 'Usuário não encontrado.' });
        }
        // Exclusão de preços de combustível relacionados
        yield prismaClient_1.default.fuelPrice.deleteMany({
            where: { userId },
        });
        // Exclusão de outros dados relacionados (adicionar mais exclusões conforme necessário)
        // Exemplo para `GasStation`, se relacionado diretamente ao usuário:
        //await prisma.gasStation.deleteMany({ where: { id: userId } });
        // Exclusão do próprio usuário
        yield prismaClient_1.default.user.delete({
            where: { id: userId },
        });
        return reply.status(200).send({ message: 'Usuário e dados relacionados excluídos com sucesso.' });
    }
    catch (error) {
        console.error('Erro ao deletar usuário:', error);
        reply.status(500).send({ error: 'Erro ao deletar o usuário.' });
    }
});
exports.deleteUser = deleteUser;

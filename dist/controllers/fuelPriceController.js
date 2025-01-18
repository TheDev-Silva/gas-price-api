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
exports.getFuelPrices = exports.addFuelPrice = void 0;
const prismaClient_1 = __importDefault(require("../models/prismaClient"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const Token = process.env.JWT_TOKEN_WEB;
const addFuelPrice = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const fuelPriceSchema = zod_1.z.object({
        gasStationName: zod_1.z.string(),
        address: zod_1.z.string(),
        fuelType: zod_1.z.string(),
        price: zod_1.z.number(),
    });
    try {
        // Validando os dados recebidos
        const { gasStationName, address, fuelType, price } = fuelPriceSchema.parse(request.body);
        // Verificando o token JWT para obter o ID do usuário
        const token = (_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Assume que o token está no cabeçalho 'Authorization'
        if (!token) {
            return reply.status(401).send({ error: 'Token de autenticação não encontrado.' });
        }
        // Verificando e decodificando o token JWT
        if (!Token) {
            return reply.status(500).send({ error: 'Token de autenticação não configurado.' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, Token);
        if (!decoded || !decoded.id) {
            return reply.status(401).send({ error: 'Token inválido ou usuário não autenticado.' });
        }
        const userId = decoded.id; // ID do usuário extraído do token
        // Verificando se o usuário existe
        const userExists = yield prismaClient_1.default.user.findUnique({
            where: { id: userId },
        });
        console.log('EXISTENTE: ', userExists);
        if (!userExists) {
            return reply.status(404).send({ error: 'Usuário não encontrado.' });
        }
        // Criação do posto de gasolina, se necessário
        const gasStationRecord = yield prismaClient_1.default.gasStation.upsert({
            where: { name_address: { name: gasStationName, address: address } },
            update: {}, // Não atualiza se já existir
            create: {
                name: gasStationName,
                address: address,
            },
        });
        // Criando o preço do combustível com o userId extraído do token
        const fuelPrice = yield prismaClient_1.default.fuelPrice.create({
            data: {
                fuelType: fuelType,
                price: price,
                address: address,
                gasStationId: gasStationRecord.id, // Relacionando com o posto de gasolina
                userId: userId, // Usando o ID do usuário extraído do token
            },
        });
        // Enviando a resposta ao cliente
        reply.status(201).send(fuelPrice);
    }
    catch (error) {
        console.error(error);
        reply.status(400).send({ error: 'Dados inválidos ou erro ao processar o preço do combustível.' });
    }
});
exports.addFuelPrice = addFuelPrice;
const getFuelPrices = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fuelType } = request.query;
        const fuelPrices = yield prismaClient_1.default.fuelPrice.findMany({
            where: {
                fuelType: {
                    startsWith: fuelType,
                    mode: 'insensitive',
                },
            },
            include: {
                GasStation: true,
                User: true
                //user: true, // Inclui as informações do usuário
                //gasStation: true, // Inclui as informações do posto de gasolina
            },
        });
        reply.send(fuelPrices);
    }
    catch (error) {
        reply.code(500).send({ error: 'Failed to fetch fuel prices' });
    }
});
exports.getFuelPrices = getFuelPrices;

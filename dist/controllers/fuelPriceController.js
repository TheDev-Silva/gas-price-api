"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFuelPrices = exports.addFuelPrice = void 0;
const prismaClient_1 = __importDefault(require("../models/prismaClient"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const Token = process.env.JWT_TOKEN_WEB;
const addFuelPrice = async (request, reply) => {
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
        const token = request.headers.authorization?.split(' ')[1]; // Assume que o token está no cabeçalho 'Authorization'
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
        const userExists = await prismaClient_1.default.user.findUnique({
            where: { id: userId },
        });
        console.log('EXISTENTE: ', userExists);
        if (!userExists) {
            return reply.status(404).send({ error: 'Usuário não encontrado.' });
        }
        // Criação do posto de gasolina, se necessário
        const gasStationRecord = await prismaClient_1.default.gasStation.upsert({
            where: { name_address: { name: gasStationName, address: address } },
            update: {}, // Não atualiza se já existir
            create: {
                name: gasStationName,
                address: address,
            },
        });
        // Criando o preço do combustível com o userId extraído do token
        const fuelPrice = await prismaClient_1.default.fuelPrice.create({
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
};
exports.addFuelPrice = addFuelPrice;
const getFuelPrices = async (request, reply) => {
    try {
        const { fuelType } = request.query;
        const fuelPrices = await prismaClient_1.default.fuelPrice.findMany({
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
};
exports.getFuelPrices = getFuelPrices;

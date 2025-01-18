"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGasStations = exports.addGasStation = void 0;
const prismaClient_1 = __importDefault(require("../models/prismaClient"));
const addGasStation = async (request, reply) => {
    const { name, address } = request.body;
    try {
        const gasStation = await prismaClient_1.default.gasStation.create({
            data: { name, address },
        });
        reply.code(201).send(gasStation);
    }
    catch (error) {
        reply.code(500).send({ error: 'Failed to add gas station' });
    }
};
exports.addGasStation = addGasStation;
const getGasStations = async (request, reply) => {
    try {
        const gasStations = await prismaClient_1.default.gasStation.findMany();
        reply.send(gasStations);
    }
    catch (error) {
        reply.code(500).send({ error: 'Failed to fetch gas stations' });
    }
};
exports.getGasStations = getGasStations;

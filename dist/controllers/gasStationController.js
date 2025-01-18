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
exports.getGasStations = exports.addGasStation = void 0;
const prismaClient_1 = __importDefault(require("../models/prismaClient"));
const addGasStation = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address } = request.body;
    try {
        const gasStation = yield prismaClient_1.default.gasStation.create({
            data: { name, address },
        });
        reply.code(201).send(gasStation);
    }
    catch (error) {
        reply.code(500).send({ error: 'Failed to add gas station' });
    }
});
exports.addGasStation = addGasStation;
const getGasStations = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gasStations = yield prismaClient_1.default.gasStation.findMany();
        reply.send(gasStations);
    }
    catch (error) {
        reply.code(500).send({ error: 'Failed to fetch gas stations' });
    }
});
exports.getGasStations = getGasStations;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gasStationController_1 = require("../controllers/gasStationController");
const gasStationRoutes = async (fastify) => {
    fastify.post('/gas-station', gasStationController_1.addGasStation); // Add a new gas station
    fastify.get('/gas-stations', gasStationController_1.getGasStations); // Get all gas stations
};
exports.default = gasStationRoutes;

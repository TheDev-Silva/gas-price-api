"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fuelPriceController_1 = require("../controllers/fuelPriceController");
const auth_1 = require("../utils/auth");
const fuelPriceRoutes = async (fastify) => {
    fastify.post('/fuel-price', fuelPriceController_1.addFuelPrice); // Add a new fuel price
    fastify.get('/fuel-prices', { preHandler: auth_1.authMiddleware }, fuelPriceController_1.getFuelPrices); // Get all fuel prices
};
exports.default = fuelPriceRoutes;

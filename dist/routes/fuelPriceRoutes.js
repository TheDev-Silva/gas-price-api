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
Object.defineProperty(exports, "__esModule", { value: true });
const fuelPriceController_1 = require("../controllers/fuelPriceController");
const auth_1 = require("../utils/auth");
const fuelPriceRoutes = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.post('/fuel-price', fuelPriceController_1.addFuelPrice); // Add a new fuel price
    fastify.get('/fuel-prices', { preHandler: auth_1.authMiddleware }, fuelPriceController_1.getFuelPrices); // Get all fuel prices
});
exports.default = fuelPriceRoutes;

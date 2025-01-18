"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userCcontroller_1 = require("../controllers/userCcontroller");
const auth_1 = require("../utils/auth");
const userRoutes = async (fastify) => {
    fastify.post('/register', userCcontroller_1.registerUser);
    fastify.get('/register-userId', { preHandler: auth_1.authMiddleware }, userCcontroller_1.getRegisterUser);
    fastify.post('/login', userCcontroller_1.loginUser);
    fastify.delete('/delete-userId', userCcontroller_1.deleteUser);
};
exports.default = userRoutes;

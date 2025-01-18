"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
// Esquema de validação para cadastro de usuário
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
    email: zod_1.z.string().email('O e-mail é inválido'),
    password: zod_1.z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});
// Esquema de validação para login de usuário
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('O e-mail é inválido'),
    password: zod_1.z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

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
const fastify_1 = __importDefault(require("fastify"));
const fuelPriceRoutes_1 = __importDefault(require("./routes/fuelPriceRoutes"));
const gasStationRoutes_1 = __importDefault(require("./routes/gasStationRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, fastify_1.default)();
// Registra as rotas
app.register(fuelPriceRoutes_1.default);
app.register(gasStationRoutes_1.default);
app.register(userRoutes_1.default);
// Exporta como uma função que Vercel pode entender
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Certifica-se de que o Fastify está pronto para processar as requisições
        yield app.ready();
        // Encaminha a requisição para o servidor Fastify
        app.server.emit('request', req, res);
    }
    catch (err) {
        // Em caso de erro, envia uma resposta diretamente
        res.statusCode = 500;
        res.end('Internal Server Error');
        console.error(err);
    }
});
if (require.main === module) {
    app.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server running at http://192.168.0.13:3000`);
    });
}
/* app.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server running at http://192.168.0.13:3000`);
}); */ 

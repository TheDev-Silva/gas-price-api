import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_TOKEN_WEB || '';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET não está configurado!');
}

export const authMiddleware = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const authHeader = request.headers.authorization;
    console.log('Cabeçalho Authorization recebido:', authHeader);

    if (!authHeader) {
        return reply.code(401).send({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
        request.user = decoded; // Adiciona os dados do usuário à requisição
        //console.log('Usuário autenticado:', token); // Log para depuração
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return reply.code(401).send({ error: 'Token expired' });
        }
        //console.error('Erro ao validar token:', error); // Log detalhado do erro
        return reply.code(401).send({ error: 'Invalid token' });
    }
};

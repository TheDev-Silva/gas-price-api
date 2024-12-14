export interface User {
    id: number; // ID único do usuário
    name: string; // Nome completo
    email: string; // E-mail do usuário
    password: string; // Senha (de preferência hash)
    createdAt: Date; // Data de criação
    updatedAt: Date; // Data de atualização
}

export interface CreateUserInput {
    name: string;
    email: string;
    password: string; // A senha será hasheada no controller
}

export interface LoginUserInput {
    email: string;
    password: string;
}

export interface AuthenticatedUser {
    id: number;
    name: string;
    email: string;
    token: string; // Token JWT ou outro tipo de autenticação
}

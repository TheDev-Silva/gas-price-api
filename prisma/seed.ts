import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const fuelTypes = [
        { name: 'Gasolina Aditivada' },
        { name: 'Gasolina Premium' },
        { name: 'Gasolina Formulada' },
        { name: 'Etanol' },
        { name: 'Etanol Aditivado' },
        { name: 'GNV (Gás Natural Veicular)' },
        { name: 'Diesel' },
        { name: 'Diesel S-10' },
    ];

    // Verifica se há um usuário existente
    const user = await prisma.user.findFirst();
    if (!user) {
        throw new Error('Nenhum usuário encontrado. Crie um usuário antes de rodar o seed.');
    }

    for (const fuelType of fuelTypes) {
        try {
            // Usa upsert para evitar duplicação
            await prisma.fuelType.upsert({
                where: { name: fuelType.name },
                update: {},
                create: {
                    name: fuelType.name,
                    createdBy: user.id, // Relacionando ao usuário
                },
            });
        } catch (error) {
            console.error(`Erro ao inserir tipo de combustível "${fuelType.name}":`, error);
        }
    }

    console.log('Tipos de combustível inseridos com sucesso!');
}

main()
    .catch((e) => {
        console.error('Erro ao executar o seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

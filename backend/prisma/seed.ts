import { PrismaClient } from '@prisma/client';
import { Argon2HashProvider } from '../src/shared/infrastructure/argon2-hash.provider';

const prisma = new PrismaClient();
const hashProvider = new Argon2HashProvider();

async function main() {

    const usuarioAdmin = await prisma.user.findFirst({
        where: { email: 'kevin01306@gmail.com' },
        include: {
            userRoles: {
                select: {
                    role: {
                        select: {
                            name: true,
                            rolePermissions: {
                                select: {
                                    permission: { select: { action: true } }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!usuarioAdmin) {
        const passwordHash = await hashProvider.hash("12345678");
        await prisma.user.create({
            data: {
                email: 'kevin01306@gmail.com',
                passwordHash,
                firstName: "Administrador",
                lastName: "Sistema",
                isActive: true,
                userRoles: {
                    create: {
                        role: {
                            connectOrCreate: {
                                where: { name: "SUPER_ADMIN" },
                                create: {
                                    name: "SUPER_ADMIN",
                                    description: "Administrador del sistema",
                                    isSystem: true,
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    console.log("✅ Categorías default creadas exitosamente");
    console.log("¡Seed ejecutado con éxito!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("❌ Error durante la ejecución del seed:", e); // IMPRESCINDIBLE para ver qué falla
        await prisma.$disconnect();
        //process.exit(1);
    });
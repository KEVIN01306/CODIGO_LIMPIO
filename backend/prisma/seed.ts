import { PrismaClient } from '@prisma/client';
import { Argon2HashProvider } from '../src/shared/infrastructure/argon2-hash.provider';

const prisma = new PrismaClient();
const hashProvider = new Argon2HashProvider();

async function main() {

    // 1. Crear Tenant por defecto
    const tenant = await prisma.tenant.upsert({
        where: { slug: 'default-tenant' },
        update: {},
        create: {
            slug: 'default-tenant',
            name: 'Institución Default',
            isActive: true,
            defaultSebConfigKey: "6c25fa7acf8e8b4cf0723e51455a54b666ada172387f087956eb89691b625c27",
            defaultSebConfigFilePath: "https://pub-02bd975ce3ff4de2ad7e79444cfd7567.r2.dev/bacd0c87-52a6-4096-97f8-1fbbd65e03fd/tenant/seb-prueba-3.seb"
        }
    });

    console.log(`✅ Tenant '${tenant.name}' asegurado.`);

    // 2. Crear Rol Super Admin (Global o por Tenant)
    let superAdminRole = await prisma.role.findFirst({
        where: { name: 'SUPER_ADMIN', tenantId: tenant.id }
    });

    if (!superAdminRole) {
        superAdminRole = await prisma.role.create({
            data: {
                name: 'SUPER_ADMIN',
                description: 'Administrador del sistema',
                isSystem: true,
                tenantId: tenant.id
            }
        });
    }

    // 3. Crear Usuario Admin
    const adminEmail = 'kevin01306@gmail.com';
    const usuarioAdmin = await prisma.user.findFirst({
        where: { email: adminEmail, tenantId: tenant.id },
    });

    if (!usuarioAdmin) {
        const passwordHash = await hashProvider.hash("12345678");
        await prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash,
                firstName: "Administrador",
                lastName: "Sistema",
                isActive: true,
                tenantId: tenant.id,
                userRoles: {
                    create: {
                        roleId: superAdminRole.id
                    }
                }
            }
        });
        console.log(`✅ Usuario Admin creado exitosamente en el tenant '${tenant.name}'`);
    } else {
        console.log(`✅ Usuario Admin ya existía en el tenant '${tenant.name}'`);
    }

    // 4. Crear permisos para los módulos académicos
    const permissionsList = [
        // Campuses
        { action: 'campuses:read', description: 'Read campuses' },
        { action: 'campuses:create', description: 'Create campuses' },
        { action: 'campuses:update', description: 'Update campuses' },
        { action: 'campuses:delete', description: 'Delete campuses' },
        // Programs
        { action: 'programs:read', description: 'Read academic programs' },
        { action: 'programs:create', description: 'Create academic programs' },
        { action: 'programs:update', description: 'Update academic programs' },
        { action: 'programs:delete', description: 'Delete academic programs' },
        // Cohorts
        { action: 'cohorts:read', description: 'Read cohorts' },
        { action: 'cohorts:create', description: 'Create cohorts' },
        { action: 'cohorts:update', description: 'Update cohorts' },
        { action: 'cohorts:delete', description: 'Delete cohorts' },
        // Cycles
        { action: 'cycles:read', description: 'Read academic cycles' },
        { action: 'cycles:create', description: 'Create academic cycles' },
        { action: 'cycles:update', description: 'Update academic cycles' },
        { action: 'cycles:delete', description: 'Delete academic cycles' },
        // Courses
        { action: 'courses:read', description: 'Read courses' },
        { action: 'courses:create', description: 'Create courses' },
        { action: 'courses:update', description: 'Update courses' },
        { action: 'courses:delete', description: 'Delete courses' },
        // Course Offerings
        { action: 'courseOfferings:read', description: 'Read course offerings' },
        { action: 'courseOfferings:create', description: 'Create course offerings' },
        { action: 'courseOfferings:update', description: 'Update course offerings' },
        { action: 'courseOfferings:delete', description: 'Delete course offerings' },
        // Course Enrollments
        { action: 'courseEnrollments:read', description: 'Read course enrollments' },
        { action: 'courseEnrollments:create', description: 'Create course enrollments' },
        { action: 'courseEnrollments:update', description: 'Update course enrollments' },
        { action: 'courseEnrollments:delete', description: 'Delete course enrollments' },
        // Users Management (Teachers and Students)
        { action: 'users:read', description: 'Read users' },
        { action: 'users:create', description: 'Create users' },
        { action: 'users:update', description: 'Update users' },
        { action: 'users:delete', description: 'Delete users' },
        // Assessments
        { action: 'assessments:read', description: 'Read assessments' },
        { action: 'assessments:create', description: 'Create assessments' },
        { action: 'assessments:update', description: 'Update assessments' },
        { action: 'assessments:delete', description: 'Delete assessments' },
        // Tenant Configuration
        { action: 'tenant:read', description: 'Read tenant configuration' },
        { action: 'tenant:update', description: 'Update tenant configuration' },
        // Roles & Permissions Matrix
        { action: 'roles:read', description: 'Read roles and permissions matrix' },
    ];

    for (const perm of permissionsList) {
        const dbPerm = await prisma.permission.upsert({
            where: { action: perm.action },
            update: { description: perm.description },
            create: {
                action: perm.action,
                description: perm.description
            }
        });

        // Asignar permiso al SUPER_ADMIN
        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: superAdminRole.id,
                    permissionId: dbPerm.id
                }
            },
            update: {},
            create: {
                roleId: superAdminRole.id,
                permissionId: dbPerm.id
            }
        });
    }

    console.log(`✅ Permisos académicos asignados al SUPER_ADMIN.`);

    // 5. Crear Campus de prueba
    const campus = await prisma.campus.upsert({
        where: { tenantId_code: { tenantId: tenant.id, code: 'CEN' } },
        update: {},
        create: {
            tenantId: tenant.id,
            code: 'CEN',
            name: 'Campus Central',
        }
    });

    // 6. Crear Rol TEACHER y STUDENT
    let teacherRole = await prisma.role.findFirst({ where: { name: 'TEACHER', tenantId: tenant.id } });
    if (!teacherRole) {
        teacherRole = await prisma.role.create({ data: { name: 'TEACHER', description: 'Catedrático', tenantId: tenant.id } });
    }

    let studentRole = await prisma.role.findFirst({ where: { name: 'STUDENT', tenantId: tenant.id } });
    if (!studentRole) {
        studentRole = await prisma.role.create({ data: { name: 'STUDENT', description: 'Estudiante', tenantId: tenant.id } });
    }

    // 7. Asignar permisos a TEACHER (Todos) y STUDENT (Solo lectura)
    for (const perm of permissionsList) {
        const dbPerm = await prisma.permission.findUnique({ where: { action: perm.action } });
        if (dbPerm) {
            // Teacher gets all assessments permissions and academic read permissions (no tenant:read required, handled at backend level)
            const isTeacherPerm =
                perm.action.startsWith('assessments:') ||
                (perm.action.endsWith(':read') && !perm.action.startsWith('tenant:') && !perm.action.startsWith('roles:'));

            if (isTeacherPerm) {
                await prisma.rolePermission.upsert({
                    where: { roleId_permissionId: { roleId: teacherRole.id, permissionId: dbPerm.id } },
                    update: {}, create: { roleId: teacherRole.id, permissionId: dbPerm.id }
                });
            } else if (perm.action.startsWith('tenant:')) {
                // Ensure teacher does not retain tenant permissions
                await prisma.rolePermission.deleteMany({
                    where: { roleId: teacherRole.id, permissionId: dbPerm.id }
                });
            }



            // Student gets assessments:read, courseEnrollments:read, courseOfferings:read, and courses:read
            if (
                perm.action === 'assessments:read' ||
                perm.action === 'courseEnrollments:read' ||
                perm.action === 'courseOfferings:read' ||
                perm.action === 'courses:read'
            ) {
                await prisma.rolePermission.upsert({
                    where: { roleId_permissionId: { roleId: studentRole.id, permissionId: dbPerm.id } },
                    update: {}, create: { roleId: studentRole.id, permissionId: dbPerm.id }
                });
            }
        }
    }

    // 8. Crear Usuario Teacher
    const teacherEmail = 'teacher@example.com';
    const teacherUser = await prisma.user.upsert({
        where: { tenantId_email: { tenantId: tenant.id, email: teacherEmail } },
        update: {},
        create: {
            email: teacherEmail,
            passwordHash: await hashProvider.hash("12345678"),
            firstName: "Profesor",
            lastName: "Prueba",
            tenantId: tenant.id,
            userRoles: { create: { roleId: teacherRole.id } },
            teacher: {
                create: {
                    campusId: campus.id,
                    employeeCode: "T-001"
                }
            }
        }
    });
    console.log(`✅ Usuario Teacher creado: ${teacherEmail}`);

    // 9. Crear Usuario Student
    const studentEmail = 'student@example.com';
    const studentUser = await prisma.user.upsert({
        where: { tenantId_email: { tenantId: tenant.id, email: studentEmail } },
        update: {},
        create: {
            email: studentEmail,
            passwordHash: await hashProvider.hash("12345678"),
            firstName: "Alumno",
            lastName: "Prueba",
            tenantId: tenant.id,
            userRoles: { create: { roleId: studentRole.id } },
            student: {
                create: {
                    campusId: campus.id,
                    studentNumber: "S-001"
                }
            }
        }
    });
    console.log(`✅ Usuario Student creado: ${studentEmail}`);

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
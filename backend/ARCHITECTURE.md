# Arquitectura del Backend (Clean / Hexagonal Architecture)

Este proyecto está construido siguiendo los principios de la **Arquitectura Limpia (Clean Architecture)** y **Arquitectura Hexagonal (Ports and Adapters)**. El objetivo principal es la separación de responsabilidades, asegurando que la lógica de negocio central (el núcleo) no dependa de detalles externos como la base de datos, los frameworks web (Express) o librerías de terceros.

---

## 1. Estructura de Carpetas (Por Módulo)

El código está estructurado en módulos (por ejemplo, `Auth`, `Users`), y dentro de cada módulo se divide en 4 capas fundamentales:

### 📁 `domain/` (Dominio)
Es el núcleo de la aplicación. Aquí residen las reglas de negocio más puras.
- **Qué va aquí:** Entidades (modelos de datos puros en TypeScript, sin métodos de base de datos), y las **Interfaces** de los repositorios y proveedores (los "Puertos").
- **Regla de oro:** No debe importar absolutamente nada de las otras capas (`application`, `infrastructure`, `presentation`), ni de librerías externas (como Prisma, Express, etc).

### 📁 `application/` (Aplicación / Casos de Uso)
Contiene la lógica de la aplicación y orquesta el flujo de los datos.
- **Qué va aquí:** Los Casos de Uso (Use Cases). Cada archivo debe representar una acción específica (ej. `login.usecase.ts`, `get-profile.usecase.ts`).
- **Regla de oro:** 
  - **Manejo de Errores:** Aquí es donde se deben hacer las validaciones lógicas del negocio y **se lanzan los errores usando `throw new AppError(...)`**. 
  - **Uso de Repositorios:** Los Use Cases no saben si se usa Prisma, MySQL o Mongo. Solo llaman a los métodos definidos en la interfaz del repositorio del dominio (ej. `this.authRepository.findByEmail()`).

### 📁 `infrastructure/` (Infraestructura)
Esta capa es el límite exterior. Es la única que sabe con qué base de datos o herramientas de terceros nos estamos conectando.
- **Qué va aquí:** 
  - Implementaciones reales de los repositorios utilizando Prisma (ej. `prisma-auth.repository.ts`).
  - Proveedores de servicios reales (ej. `jwt.provider.ts`, `argon2-hash.provider.ts`).
  - **Mappers:** Transforman los objetos crudos que vienen de la base de datos (Prisma) a nuestras entidades puras de `domain/`.

### 📁 `presentation/` (Presentación)
Es la puerta de entrada a la aplicación (el lado del servidor web).
- **Qué va aquí:** Controladores (`.controller.ts`), rutas (`.routes.ts`) y esquemas de validación (usando Zod).
- **Regla de oro:** 
  - El controlador **no contiene lógica de negocio**. Solo recibe la petición HTTP (`req`), extrae los datos, llama al Caso de Uso y responde (`res`) usando el formato estándar (`ResponseHttp.success`).
  - Todo error es capturado aquí y pasado al middleware global mediante `catch(error) { next(error) }`.

---

## 2. Reglas Principales de Desarrollo

### Inyección de Dependencias (`.module.ts`)
Para mantener el desacoplamiento, **nunca se debe instanciar un repositorio o proveedor dentro de un Use Case o Controller usando `new`**. Todo se debe inyectar por el constructor.
En la raíz de cada módulo (ej. `auth.module.ts`) es donde ocurre la "magia" de ensamblar las piezas:
1. Instanciamos Prisma y los proveedores (`HashProvider`, `JwtProvider`).
2. Instanciamos el repositorio real pasándole la DB (`PrismaAuthRepository`).
3. Instanciamos los casos de uso inyectándoles el repositorio y los proveedores.
4. Finalmente, instanciamos el Controller inyectándole los casos de uso, para luego exportarlo y usarlo en las rutas.

### Validaciones
- **Sintácticas (Zod):** Validaciones de forma (que el email sea un email válido, que la contraseña tenga mínimo 8 caracteres). Esto se hace en la capa de `presentation/` a través de esquemas interceptados por un middleware (ej. `ValidatedMiddleware`).
- **Semánticas (Negocio):** Validaciones lógicas (que el usuario exista, que la contraseña coincida). Estas se hacen en los Casos de Uso (`application/`) lanzando un `AppError`.

---

## 3. Guía Técnica: Módulo de Autenticación (Auth)

El módulo de Auth está diseñado para manejar la seguridad mediante JWT, guardando una única sesión activa por usuario en la base de datos (relación 1 a 1).

### ¿Para qué sirve cada parte?

- **`AuthUser` (Dominio):** Define la estructura del usuario en memoria. Tiene campos clave como `id`, `email`, `roles` y `permissions` extraídos a partir de una consulta relacional de Prisma (Role -> RolePermission).
- **`AuthSession` (Dominio):** Representa la sesión. Contiene el `token` (refreshToken), `userId` y la fecha de expiración. 

### ¿Cómo está conectado (Flujo de Login)?
1. **Ruta (`auth.routes.ts`):** Recibe el POST en `/login` y pasa por el validador Zod.
2. **Controller (`auth.controller.ts`):** Llama a `loginUseCase.execute()`.
3. **Use Case (`login.usecase.ts`):**
   - Llama a `authRepository.findByEmail()` para traer al usuario.
   - Si no existe o está inactivo, hace `throw new AppError(...)`.
   - Llama a `hashProvider.compare()` para verificar la contraseña.
   - Si todo es correcto, llama a `jwtProvider.generateTokens()` generando 2 tokens:
     - **Access Token:** Tiempo de vida corto (ej. 15 min). Se envía al frontend como payload de la petición HTTP. Incluye los `roles` y `permissions` incrustados.
     - **Refresh Token:** Tiempo de vida largo (ej. 7 días). Se inyecta en una cookie `httpOnly` para mayor seguridad.
   - Usa `authRepository.upsertSession()` asegurando que el nuevo Refresh Token sobrescriba la sesión previa en la base de datos para ese usuario único.
4. **Respuesta:** El controller responde usando el estándar `ResponseHttp`.

### El Middleware de Protección
El `AuthMiddleware.routeProtect` lee el *Access Token* de la cabecera HTTP, lo verifica con el `jwtProvider` y extrae el usuario, guardándolo en `res.locals.user` para que casos de uso posteriores (como `GetProfileUseCase`) sepan de manera segura quién está ejecutando la petición sin tener que volver a consultar roles y permisos a la base de datos repetidamente.

---

## 4. Guía Técnica: Módulo de Usuarios (Users)

El módulo de usuarios permite gestionar las identidades dentro del sistema, implementando un CRUD estándar con una variación: **eliminación lógica**.

### Entidades y DTOs (Data Transfer Objects)
Para evitar la fuga de información sensible (como contraseñas o hashes) hacia las capas de presentación, la entidad central `User` se extiende en múltiples interfaces (`user.entity.ts`) que fungen como DTOs:
- **`CreateUser`**: Tipado para los datos requeridos al crear.
- **`UpdateUser`**: Tipado de campos opcionales permitidos en actualización.
- **`GetUser`**: Entidad completa omitiendo el `passwordHash` (Ideal para retornar un perfil).
- **`GetSimpleUser`**: Versión ligera del usuario, solo incluye información esencial (`id`, `firstName`, `lastName`, `email`, `isActive`), útil para operaciones como el listado en masa.

Estos tipos especializados garantizan que tanto la base de datos (Prisma Repository) como los Casos de Uso expongan exclusivamente los datos permitidos a los Controladores.

### Estructura de Casos de Uso
- **`CreateUserUseCase`**: Hashea la contraseña utilizando `Argon2HashProvider` antes de guardarla. Valida que el email no exista.
- **`UpdateUserUseCase`**: Permite cambiar datos básicos o contraseña. Valida colisiones de email en caso de ser actualizado.
- **`ListUsersUseCase`**: Lista todos los usuarios devolviendo un arreglo de `GetSimpleUser`.
- **`DisableUserUseCase` / `DeleteUserUseCase`**: Ambos ejecutan una baja lógica cambiando `isActive` a `false`. Esto previene que el usuario inicie sesión pero mantiene la integridad referencial para el historial de auditoría o transacciones pasadas.

### Integración con Rutas y Validación
Las rutas (`/users`) instancian explícitamente sus middlewares (`new AuthMiddleware()`, `new ValidatedMiddleware()`) para la inyección y protección. Utilizan Zod schemas (`CreateUserSchema`, etc.) aplicados vía `validateBody` o `validateParams` para rechazar peticiones mal formadas en la capa de presentación.

### Manejo de Errores
El módulo implementa un manejo robusto de excepciones:
1. **Infraestructura (`PrismaUsersRepository`)**: Todos los métodos están envueltos en `try-catch` y delegan las excepciones a `PrismaErrorMapper.map(error)`. Este mapper convierte errores nativos de base de datos (e.g. código `P2002` o `P2025`) en errores genéricos de persistencia (`UniqueConstraintError`, `NotFoundPersistenceError`).
2. **Aplicación (Casos de Uso)**: Capturan dichos errores de persistencia mediante un bloque `try-catch` y los traducen a objetos `AppError` con un `statusCode` HTTP y un `code` manejable por la capa web, evitando así que los detalles de la base de datos se filtren a la API web.

---

## 5. Guía Técnica: Módulo de Auditoría (Audit)

Este módulo se encarga de dejar un rastro inmutable (o cuasi inmutable) de las acciones importantes en el sistema.

### Estructura de Casos de Uso
- **`CreateAuditLogUseCase`**: Caso de uso que puede ser invocado de forma interna por otros módulos o vía endpoint (si es necesario). Recibe una acción del Enum (`LOGIN`, `CREATE`, `UPDATE`, etc), el recurso afectado y el ID del usuario responsable.
- **`ListAuditLogsUseCase`**: Expuesto a través del controlador para poder consultar el historial.

### Flujo de Auditoría
El modelo `AuditLog` incluye un campo `details` de tipo JSON en Prisma. Esto es vital para guardar diffs (cambios) de las entidades afectadas o metadatos de la conexión (como IP y User-Agent) sin necesidad de tablas complejas.

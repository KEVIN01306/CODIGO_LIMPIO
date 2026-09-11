Frontend Architecture

1. Purpose

This document defines the frontend architecture, folder structure, naming conventions, routing strategy, authentication flow, API communication rules, and form implementation standards for Asyncronix.

The project follows Clean Architecture principles with a strong separation between:

Global infrastructure.

Domain definitions.

API communication.

Module-specific functionality.

Presentation.

Shared reusable UI.

Important: All source code, file names, folder names, identifiers, comments, and visible UI text must be written in English.

2. Main Folder Structure

src/
├── core/
│   ├── api/
│   ├── store/
│   ├── theme/
│   └── utils/
│
├── modules/
│   ├── auth/
│   ├── users/
│   ├── clients/
│   └── ...
│
├── presentation/
│   ├── layouts/
│   │   ├── blankLayout/
│   │   └── fullLayout/
│   └── routes/
│       ├── ProtectedRoute.tsx
│       └── appRouter.tsx
│
└── shared/
    ├── components/
    └── pages/

3. Core

core/ contains resources used throughout the entire application.

core/
├── api/
├── store/
├── theme/
└── utils/

3.1 core/api

Contains the centralized Axios configuration.

Responsibilities:

API base configuration.

Authentication headers.

Global Axios interceptors.

Early HTTP error handling.

Token-related behavior when applicable.

The API origin/base URL should come from the environment configuration through the centralized core configuration.

Example:

export const API_BASE_URL = import.meta.env.VITE_API_URL;

Then a service can define its resource URL:

const AUTH_BASE_URL = `${API_BASE_URL}/auth`;

Authenticated requests

Use the configured authenticated Axios instance:

import { api } from '../../../core/api';

Public requests

For endpoints that do not require authentication, such as login when applicable, use plain Axios rather than the authenticated instance.

4. Core Store

core/store/ contains global Zustand stores.

Example:

core/
└── store/
    ├── authStore.ts
    └── ...

Stores should contain global application state, not UI-specific state that belongs to a component.

5. Core Theme

core/theme/ contains the MUI theme and global visual configuration.

Example:

core/
└── theme/
    ├── theme.ts
    ├── palette.ts
    └── typography.ts

The exact files may evolve, but theme configuration belongs in core, not inside an individual module.

6. Core Utils

core/utils/ contains utilities that can legitimately be reused by the entire application.

Examples:

formatDate.ts
formatMoney.ts
compressImage.ts

Utilities must remain generic.

If a function is only useful to one module, it belongs in that module's infrastructure/functions/.

7. Modules

Every business feature should have its own module.

Example:

modules/
└── clients/
    ├── domain/
    ├── infrastructure/
    └── presentation/

Each module follows:

module/
├── domain/
├── infrastructure/
└── presentation/

8. Domain

The domain describes the data contracts and validation rules of the module.

domain/
├── schemas/
├── interfaces/
└── dto/

8.1 Schemas

Zod schemas belong here.

Example:

clients/
└── domain/
    └── schemas/
        └── client.schemas.ts

Example:

import { z } from 'zod';

export const clientSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

Schemas should be reused by forms through zodResolver.

9. Interfaces

Module-specific entities, interfaces, and types belong here.

Example:

clients/
└── domain/
    └── interfaces/
        └── client.interfaces.ts

Example:

export interface Client {
    id: string;
    name: string;
    email: string;
}

10. DTOs

DTOs contain structures or transformations intended for API/UI communication or display.

Example:

clients/
└── domain/
    └── dto/
        └── client.dto.ts

The DTO layer should prevent API-specific structures from unnecessarily leaking into presentation.

11. Infrastructure

Infrastructure contains external communication and module-specific technical helpers.

infrastructure/
├── services/
└── functions/

12. Services

Services communicate with the backend API.

Example:

clients/
└── infrastructure/
    └── services/
        └── client.service.ts

Service rules

Every service should:

Import the appropriate Axios instance.

Use the centralized API base URL.

Define its module/resource URL.

Perform HTTP requests.

Use authenticated api for protected endpoints.

Use plain Axios for public endpoints when required.

Avoid presentation logic.

Export functions explicitly at the end.

Example:

import { api } from '../../../core/api';
import { API_BASE_URL } from '../../../core/api/config';

const CLIENTS_BASE_URL = `${API_BASE_URL}/clients`;

const getClients = async () => {
    const response = await api.get(CLIENTS_BASE_URL);
    return response.data;
};

const createClient = async (data: CreateClientDto) => {
    const response = await api.post(CLIENTS_BASE_URL, data);
    return response.data;
};

export {
    getClients,
    createClient,
};

13. Module Functions

infrastructure/functions/ contains functions used only inside the current module.

Example:

clients/
└── infrastructure/
    └── functions/
        └── buildClientPayload.functions.ts

Rules:

TypeScript only.

.ts, not .tsx.

No React components.

No UI rendering.

Do not put globally reusable functions here.

14. Presentation

Module presentation contains React code.

presentation/
├── pages/
├── components/
├── clients.lazy.ts
└── clients.routes.ts

15. Pages

Pages represent route-level screens.

Naming convention:

<Module><Action>.page.tsx

Examples:

ClientsList.page.tsx
ClientCreate.page.tsx
ClientEdit.page.tsx
ClientDetail.page.tsx

Pages should coordinate presentation and application flow but should not become repositories or service layers.

16. Components

Module-specific reusable UI components belong in components/.

Examples:

ClientForm.component.tsx
ClientTable.component.tsx
ClientFilters.component.tsx

If a component is only relevant to one module, keep it inside that module.

If a component is useful throughout the application, move it to shared/components/.

17. Lazy Exports

Each module should expose its pages through a lazy entry point.

Example:

clients.lazy.ts

Conceptual export:

export { default as ClientsListPage } from './pages/ClientsList.page';
export { default as ClientCreatePage } from './pages/ClientCreate.page';
export { default as ClientDetailPage } from './pages/ClientDetail.page';

When the project requires actual React lazy loading, keep that behavior centralized in the lazy entry point.

The objective is that routes consume the prepared page exports rather than implementing lazy-loading logic themselves.

18. Module Routes

Every module exposes a RouteObject[].

Example:

import type { RouteObject } from 'react-router-dom';

export const clientsRoutes: RouteObject[] = [
    {
        path: 'clients',
        children: [
            {
                index: true,
                element: (
                    <RouteProtector requiredPermission="VIEW_CLIENTS">
                        <ClientsListPage />
                    </RouteProtector>
                ),
            },
        ],
    },
];

Routes must be exported as arrays.

19. Route Protection

Protected module pages should use RouteProtector.

Example:

<RouteProtector requiredPermission="VIEW_CLIENTS">
    <ClientsListPage />
</RouteProtector>

Create:

<RouteProtector requiredPermission="CREATE_CLIENTS">
    <ClientCreatePage />
</RouteProtector>

Edit:

<RouteProtector requiredPermission="EDIT_CLIENTS">
    <ClientEditPage />
</RouteProtector>

Detail:

<RouteProtector requiredPermission="VIEW_CLIENT_DETAILS">
    <ClientDetailPage />
</RouteProtector>

Permissions must be explicit in the route definition.

20. Global Presentation

The root presentation/ folder contains application-level presentation infrastructure.

presentation/
├── layouts/
└── routes/

21. Layouts

Current layouts:

layouts/
├── blankLayout/
└── fullLayout/

Each layout should expose an index.ts.

Example:

export { default } from './BlankLayout';

22. Blank Layout

Used mainly for public/authentication screens.

Basic structure:

import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

const BlankLayout = () => {
    return (
        <Box>
            <main>
                <Container maxWidth="lg">
                    <Outlet />
                </Container>
            </main>
        </Box>
    );
};

export default BlankLayout;

The exact visual implementation may evolve, but the layout should provide the Outlet where child routes render.

23. Full Layout

The authenticated application layout should be decomposed to avoid an oversized file.

Example:

fullLayout/
├── FullLayout.tsx
├── index.ts
├── navbar/
├── sidebar/
└── components/

The final FullLayout.tsx composes:

Navbar.

Sidebar.

Main content.

Global layout components.

24. ProtectedRoute

presentation/routes/ProtectedRoute.tsx is responsible for global authentication validation.

Responsibilities:

Check whether an access token exists.

Avoid refresh if no token exists.

Refresh the token when necessary.

Update the authentication store.

Retrieve the current user.

Log out if refresh/session validation fails.

Show a full-page loader while validation is running.

Redirect unauthenticated users to /auth/login.

Preserve the original location using state.from.

Conceptual structure:

const ProtectedRoute = () => {
    const location = useLocation();

    // Validate token/session here.

    if (isLoading) {
        return <FullPageLoader message="Validating session..." />;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/auth/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return <Outlet />;
};

25. App Router

appRouter is the central route composition point.

Conceptual structure:

const appRouter = createBrowserRouter([
    {
        path: '/auth',
        element: (
            <Suspense fallback={<FullPageLoader />}>
                <BlankLayout />
            </Suspense>
        ),
        children: [
            ...authRoutes,
        ],
    },
    {
        path: '/',
        element: (
            <Suspense fallback={<FullPageLoader />}>
                <ProtectedRoute />
            </Suspense>
        ),
        children: [
            {
                element: (
                    <Suspense fallback={<FullPageLoader />}>
                        <FullLayout />
                    </Suspense>
                ),
                children: [
                    ...dashboardRoutes,
                    ...clientsRoutes,
                    ...usersRoutes,
                    ...otherModuleRoutes,
                    {
                        path: 'access-denied',
                        element: <AccessDeniedPage />,
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);

Modules own their routes. appRouter composes them.

26. Shared

shared/ contains global resources that do not belong to a specific business module.

shared/
├── components/
└── pages/

27. Shared Pages

Global pages belong in:

shared/pages/

Example:

AccessDeniedPage.tsx

This page is used when a user lacks permission to access a page.

Expected behavior:

Display an access denied message.

Explain that the user does not have permission.

Provide useful information.

Provide an action to return home.

28. Shared Components

Global reusable UI components belong in:

shared/components/

Examples:

tables/
buttons/
loaders/
dialogs/
inputs/
empty-states/
error-states/

Typical shared components may include:

Tables.

Buttons.

Loaders.

Dialogs.

Inputs.

Common form controls.

Empty states.

Error states.

Before creating a new module component, check whether an existing shared component can be reused.

29. React Hook Form — Mandatory Rule

Every form must use React Hook Form

Any interaction where a user fills data and submits it must use:

react-hook-form

This is mandatory.

Applies to:

Login.

Registration.

Create forms.

Edit forms.

Password forms.

Search/filter forms with submit behavior.

Modal forms.

Dialog forms.

Confirmation forms that require user-entered values.

Any other data-entry + submit workflow.

30. Form Validation

Use:

react-hook-form
+
@hookform/resolvers
+
zod

Example:

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const {
    control,
    handleSubmit,
    formState: {
        errors,
        isSubmitting,
    },
} = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: '',
        email: '',
    },
});

31. Form Submit

Submit must use handleSubmit.

const onSubmit = async (values: FormValues) => {
    await createClient(values);
};

return (
    <form onSubmit={handleSubmit(onSubmit)}>
        {/* fields */}
    </form>
);

Do not manually manage form values with useState when React Hook Form is appropriate.

32. MUI Controlled Components

For MUI components that require controlled behavior, use Controller.

Example:

<Controller
    name="name"
    control={control}
    render={({ field, fieldState }) => (
        <TextField
            {...field}
            label="Name"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
        />
    )}
/>

33. Form State

Prefer React Hook Form for:

Field values.

Validation state.

Dirty state.

Submission state.

Field errors.

Resetting.

Watching fields.

Useful APIs:

useForm
Controller
useFieldArray
useWatch

Use local React state only for UI state that is not actually form data, for example:

const [isDialogOpen, setIsDialogOpen] = useState(false);

Do not use:

const [name, setName] = useState('');

as the primary form-value mechanism when the field belongs to a submitted form.

34. Naming Conventions

Use English consistently.

Recommended suffixes:

.page.tsx
.component.tsx
.service.ts
.schemas.ts
.interfaces.ts
.dto.ts
.functions.ts
.routes.ts
.lazy.ts

Examples:

ClientList.page.tsx
ClientForm.component.tsx
client.service.ts
client.schemas.ts
client.interfaces.ts
client.dto.ts
client.functions.ts
clients.routes.ts
clients.lazy.ts

35. Responsibility Matrix

Layer

Responsibility

core

Global infrastructure/configuration

core/api

Axios/API infrastructure

core/store

Global state

core/theme

MUI/global visual configuration

core/utils

Global utilities

modules/*/domain

Contracts, schemas, entities, DTOs

modules/*/infrastructure/services

API communication

modules/*/infrastructure/functions

Module-only helpers

modules/*/presentation/pages

Route-level screens

modules/*/presentation/components

Module UI components

modules/*/presentation/*.routes.ts

Module routing

modules/*/presentation/*.lazy.ts

Lazy page exports

presentation/layouts

Application layouts

presentation/routes

Global routing/auth protection

shared/pages

Global pages

shared/components

Global reusable UI

36. Implementation Checklist

When implementing a new feature:

Identify the correct module.

Create/update domain interfaces.

Create Zod schemas when validation is required.

Create/update DTOs when needed.

Create API services.

Use the correct Axios instance.

Keep module-only helpers in functions.

Create pages.

Create module-specific components.

Implement every data-entry form with React Hook Form.

Connect Zod through zodResolver.

Use Controller for controlled MUI components.

Create/update lazy exports.

Create/update module routes.

Apply RouteProtector and permissions.

Integrate module routes into appRouter.

Reuse shared components where appropriate.

Keep global utilities in core/utils.

Keep all code and UI text in English.

Avoid unrelated changes.

Keep responsibilities separated.

37. Golden Rules

Clean Architecture is mandatory.

All code and UI text must be in English.

Every submitted form must use React Hook Form.

Zod is the validation layer for forms.

HTTP communication belongs in services.

Module-only helpers belong in infrastructure functions.

Global helpers belong in core utils.

Global UI belongs in shared.

Module UI belongs in the module presentation layer.

Routes belong to their modules; appRouter composes them.

Protected pages must explicitly declare their required permission.

Authentication/session validation belongs in ProtectedRoute.

Layouts must remain reusable and composable.

Avoid duplicated components and utilities.

Do not put business logic directly inside JSX.

Do not create unnecessary global abstractions.

Keep files focused and maintainable.

Do not mix Spanish and English in implementation.

Prefer existing project conventions over introducing new patterns.

When a requirement is ambiguous, choose the solution that preserves these architectural boundaries and consistency.

38. Reference Prompt

Use the following prompt when asking an AI coding agent to implement frontend work in this project:

Implement the requested frontend functionality following FRONTEND_ARCHITECTURE.md strictly.

The project follows Clean Architecture. Keep domain, infrastructure, presentation, global infrastructure, and shared UI responsibilities separated.

All code, identifiers, file names, folder names, comments, and UI text must be in English.

Every form or interaction where the user enters data and submits it MUST use React Hook Form. Use Zod schemas from the module's domain/schemas and connect them with zodResolver. Use Controller when required by controlled MUI components. Do not replace React Hook Form with manual useState field management.

API communication must be implemented through the module's infrastructure services. Use the configured authenticated Axios instance for protected endpoints and plain Axios for public authentication endpoints when appropriate.

Reuse existing core utilities and shared components before creating duplicates.

Keep module-specific helpers in infrastructure/functions.

Create or update pages, components, lazy exports, and module routes according to the documented naming conventions.

Protect restricted pages with RouteProtector and explicitly specify the required permission.

Integrate the module routes into the central appRouter without moving business logic into the router.

Do not make unrelated changes.

Before implementing, inspect the existing project structure and reuse established patterns whenever possible.

If a requirement is ambiguous, choose the implementation that best preserves Clean Architecture, React Hook Form standards, modularity, and consistency with the existing codebase.
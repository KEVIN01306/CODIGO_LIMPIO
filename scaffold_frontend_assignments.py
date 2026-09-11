import os

base_dir = "frontend/src/modules/assignment"
models = [
    {
        "name": "CourseOffering",
        "lower": "courseOffering",
        "plural": "Course Offerings",
        "path": "offerings"
    },
    {
        "name": "CourseEnrollment",
        "lower": "courseEnrollment",
        "plural": "Course Enrollments",
        "path": "enrollments"
    }
]

for model in models:
    mod_dir = os.path.join(base_dir, model["lower"])
    domain_dir = os.path.join(mod_dir, "domain")
    infra_dir = os.path.join(mod_dir, "infrastructure")
    pres_dir = os.path.join(mod_dir, "presentation")
    comp_dir = os.path.join(pres_dir, "components")
    pages_dir = os.path.join(pres_dir, "pages")
    
    os.makedirs(domain_dir, exist_ok=True)
    os.makedirs(infra_dir, exist_ok=True)
    os.makedirs(comp_dir, exist_ok=True)
    os.makedirs(pages_dir, exist_ok=True)

    # 1. domain interfaces
    with open(os.path.join(domain_dir, f"{model['lower']}.interfaces.ts"), "w") as f:
        f.write(f"""export interface {model['name']} {{
  id: string;
  createdAt: string;
  updatedAt?: string;
}}

export interface Create{model['name']}DTO {{}}
export interface Update{model['name']}DTO {{}}
export interface {model['name']}FormValues {{}}
""")

    # 2. domain schema
    with open(os.path.join(domain_dir, f"{model['lower']}.schema.ts"), "w") as f:
        f.write(f"""import {{ z }} from 'zod';
export const {model['lower']}Schema = z.object({{}});
""")

    # 3. infrastructure service
    with open(os.path.join(infra_dir, f"{model['lower']}.service.ts"), "w") as f:
        f.write(f"""import api from '../../../../core/api/axios.config';
import type {{ {model['name']}, Create{model['name']}DTO, Update{model['name']}DTO }} from '../domain/{model['lower']}.interfaces';
import type {{ PaginatedResponse, PaginationParams }} from '../../../../shared/domain/pagination.interfaces';

const API_URL = '/assignments/{model['path']}';

export const get{model['name']}s = async (params?: PaginationParams): Promise<PaginatedResponse<{model['name']}>> => {{
  const response = await api.get(API_URL, {{ params }});
  return response.data;
}};

export const get{model['name']}ById = async (id: string): Promise<{model['name']}> => {{
  const response = await api.get(`${{API_URL}}/${{id}}`);
  return response.data.data;
}};

export const create{model['name']} = async (data: Create{model['name']}DTO): Promise<{model['name']}> => {{
  const response = await api.post(API_URL, data);
  return response.data.data;
}};

export const update{model['name']} = async (id: string, data: Update{model['name']}DTO): Promise<{model['name']}> => {{
  const response = await api.put(`${{API_URL}}/${{id}}`, data);
  return response.data.data;
}};

export const delete{model['name']} = async (id: string): Promise<void> => {{
  await api.delete(`${{API_URL}}/${{id}}`);
}};
""")

    # 4. component form
    with open(os.path.join(comp_dir, f"{model['name']}Form.component.tsx"), "w") as f:
        f.write(f"""import React from 'react';
import {{ Box, Button, CircularProgress }} from '@mui/material';
import {{ useNavigate }} from 'react-router-dom';

const {model['name']}Form = ({{ initialData }}: any) => {{
  const navigate = useNavigate();
  return (
    <Box>
      <Button onClick={{() => navigate('/assignment/{model['path']}')}}>Cancel</Button>
    </Box>
  );
}};
export default {model['name']}Form;
""")

    # 5. pages list
    with open(os.path.join(pages_dir, f"{model['name']}List.page.tsx"), "w") as f:
        f.write(f"""import React from 'react';
import {{ Box, Typography, Button }} from '@mui/material';
import {{ useNavigate }} from 'react-router-dom';

const {model['name']}List = () => {{
  const navigate = useNavigate();
  return (
    <Box sx={{{{ p: 3 }}}}>
      <Typography variant="h5">{model['plural']}</Typography>
      <Button onClick={{() => navigate('/assignment/{model['path']}/create')}}>Create</Button>
    </Box>
  );
}};
export default {model['name']}List;
""")

    # 6. pages create
    with open(os.path.join(pages_dir, f"{model['name']}Create.page.tsx"), "w") as f:
        f.write(f"""import React from 'react';
import {{ Box, Typography }} from '@mui/material';
import {model['name']}Form from '../components/{model['name']}Form.component';

const {model['name']}Create = () => {{
  return (
    <Box sx={{{{ p: 3 }}}}>
      <Typography variant="h5">Create {model['name']}</Typography>
      <{model['name']}Form />
    </Box>
  );
}};
export default {model['name']}Create;
""")

    # 7. pages edit
    with open(os.path.join(pages_dir, f"{model['name']}Edit.page.tsx"), "w") as f:
        f.write(f"""import React from 'react';
import {{ Box, Typography }} from '@mui/material';
import {model['name']}Form from '../components/{model['name']}Form.component';

const {model['name']}Edit = () => {{
  return (
    <Box sx={{{{ p: 3 }}}}>
      <Typography variant="h5">Edit {model['name']}</Typography>
      <{model['name']}Form />
    </Box>
  );
}};
export default {model['name']}Edit;
""")

    # 8. pages detail
    with open(os.path.join(pages_dir, f"{model['name']}Detail.page.tsx"), "w") as f:
        f.write(f"""import React from 'react';
import {{ Box, Typography }} from '@mui/material';

const {model['name']}Detail = () => {{
  return (
    <Box sx={{{{ p: 3 }}}}>
      <Typography variant="h5">{model['name']} Detail</Typography>
    </Box>
  );
}};
export default {model['name']}Detail;
""")

# Create assignment.routes.tsx
pres_root = os.path.join(base_dir, "presentation")
os.makedirs(pres_root, exist_ok=True)
with open(os.path.join(pres_root, "assignment.routes.tsx"), "w") as f:
    f.write("""import { RouteObject } from 'react-router-dom';
import RouteProtector from '../../core/auth/RouteProtector';
import React, { lazy, Suspense } from 'react';

const CourseOfferingList = lazy(() => import('./courseOffering/presentation/pages/CourseOfferingList.page'));
const CourseOfferingCreate = lazy(() => import('./courseOffering/presentation/pages/CourseOfferingCreate.page'));
const CourseOfferingEdit = lazy(() => import('./courseOffering/presentation/pages/CourseOfferingEdit.page'));
const CourseOfferingDetail = lazy(() => import('./courseOffering/presentation/pages/CourseOfferingDetail.page'));

const CourseEnrollmentList = lazy(() => import('./courseEnrollment/presentation/pages/CourseEnrollmentList.page'));
const CourseEnrollmentCreate = lazy(() => import('./courseEnrollment/presentation/pages/CourseEnrollmentCreate.page'));
const CourseEnrollmentEdit = lazy(() => import('./courseEnrollment/presentation/pages/CourseEnrollmentEdit.page'));
const CourseEnrollmentDetail = lazy(() => import('./courseEnrollment/presentation/pages/CourseEnrollmentDetail.page'));

const Loader = () => <div>Loading...</div>;

export const assignmentRoutes: RouteObject = {
  path: 'assignment',
  children: [
    {
      path: 'offerings',
      children: [
        { index: true, element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="courseOfferings:read"><CourseOfferingList /></RouteProtector></Suspense> },
        { path: 'create', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="courseOfferings:create"><CourseOfferingCreate /></RouteProtector></Suspense> },
        { path: ':id', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="courseOfferings:read"><CourseOfferingDetail /></RouteProtector></Suspense> },
        { path: ':id/edit', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="courseOfferings:update"><CourseOfferingEdit /></RouteProtector></Suspense> },
      ]
    },
    {
      path: 'enrollments',
      children: [
        { index: true, element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="courseEnrollments:read"><CourseEnrollmentList /></RouteProtector></Suspense> },
        { path: 'create', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="courseEnrollments:create"><CourseEnrollmentCreate /></RouteProtector></Suspense> },
        { path: ':id', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="courseEnrollments:read"><CourseEnrollmentDetail /></RouteProtector></Suspense> },
        { path: ':id/edit', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="courseEnrollments:update"><CourseEnrollmentEdit /></RouteProtector></Suspense> },
      ]
    }
  ]
};
""")
print("Frontend scaffolding created.")

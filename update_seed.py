import re

with open("backend/prisma/seed.ts", "r") as f:
    content = f.read()

new_permissions = """
        { action: 'courseOfferings:read', resource: 'CourseOfferings', description: 'View course offerings' },
        { action: 'courseOfferings:create', resource: 'CourseOfferings', description: 'Create course offerings' },
        { action: 'courseOfferings:update', resource: 'CourseOfferings', description: 'Update course offerings' },
        { action: 'courseOfferings:delete', resource: 'CourseOfferings', description: 'Delete course offerings' },
        { action: 'courseEnrollments:read', resource: 'CourseEnrollments', description: 'View course enrollments' },
        { action: 'courseEnrollments:create', resource: 'CourseEnrollments', description: 'Create course enrollments' },
        { action: 'courseEnrollments:update', resource: 'CourseEnrollments', description: 'Update course enrollments' },
        { action: 'courseEnrollments:delete', resource: 'CourseEnrollments', description: 'Delete course enrollments' },
"""

if 'courseOfferings:read' not in content:
    content = content.replace("const academicPermissions = [", f"const academicPermissions = [{new_permissions}")

with open("backend/prisma/seed.ts", "w") as f:
    f.write(content)

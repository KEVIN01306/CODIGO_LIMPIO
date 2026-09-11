import {
  DashboardOutlined,
  SchoolOutlined,
  MenuBookOutlined,
  AssignmentOutlined,
  GroupOutlined,
  SettingsOutlined,
  BusinessOutlined,
  HistoryEduOutlined,
  FactCheckOutlined,
  AdminPanelSettingsOutlined
} from '@mui/icons-material';
import type { ElementType } from 'react';

export interface MenuItem {
  name?: string;
  module?: string;
  group?: string;
  link?: string;
  icon?: ElementType;
  permissions?: string[];
  requiresStudent?: boolean;
  requiresTeacher?: boolean;
  children?: MenuItem[];
}

const MenuItems: MenuItem[] = [
  { group: "Main" },
  { name: "Dashboard", icon: DashboardOutlined, link: "/" },

  { group: "Academic Catalog", permissions: ["campuses:read", "programs:read", "cohorts:read", "cycles:read", "courses:read"] },
  {
    module: "Catalog",
    name: "Catalog Management",
    icon: MenuBookOutlined,
    children: [
      { name: "Campuses", link: "/academic/campuses", icon: BusinessOutlined, permissions: ["campuses:read"] },
      { name: "Programs", link: "/academic/programs", icon: HistoryEduOutlined, permissions: ["programs:read"] },
      { name: "Cohorts", link: "/academic/cohorts", icon: GroupOutlined, permissions: ["cohorts:read"] },
      { name: "Cycles", link: "/academic/cycles", icon: FactCheckOutlined, permissions: ["cycles:read"] },
      { name: "Courses", link: "/academic/courses", icon: SchoolOutlined, permissions: ["courses:read"] },
    ]
  },

  { group: "Academic Assignments", permissions: ["courseOfferings:read", "courseEnrollments:read"] },
  {
    module: "Assignments",
    name: "Assignments",
    icon: AssignmentOutlined,
    children: [
      { name: "Course Offerings", link: "/assignment/offerings", icon: SchoolOutlined, permissions: ["courseOfferings:read"] },
      { name: "Enrollments", link: "/assignment/enrollments", icon: GroupOutlined, permissions: ["courseEnrollments:read"] },
    ]
  },

  { group: "Student Dashboard", requiresStudent: true },
  {
    name: "My Courses",
    icon: SchoolOutlined,
    link: "/my-courses",
    requiresStudent: true
  },
  {
    name: "Grades",
    icon: FactCheckOutlined,
    link: "/grades",
    requiresStudent: true
  },

  { group: "Teacher Dashboard", requiresTeacher: true },
  {
    name: "Taught Courses",
    icon: MenuBookOutlined,
    link: "/taught-courses",
    requiresTeacher: true
  },
  {
    name: "Assignments",
    icon: AssignmentOutlined,
    link: "/assignments",
    requiresTeacher: true
  },

  { group: "System Administration" },
  {
    module: "Settings",
    name: "System Settings",
    icon: SettingsOutlined,
    children: [
      { name: "Tenant", link: "/admin/tenant", icon: BusinessOutlined, permissions: ["tenant:read"] },
      { name: "Roles & Permissions", link: "/admin/roles", icon: AdminPanelSettingsOutlined, permissions: ["roles:read"] },
      { name: "Users", link: "/admin/users", icon: GroupOutlined, permissions: ["users:read"] },
    ]
  },
];

export default MenuItems;

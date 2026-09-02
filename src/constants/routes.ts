export const ROUTES = {
  // Auth
  LOGIN: '/',
  COMPANY_USER_LOGIN: '/company-user-login',
  DASHBOARD_LOGIN: '/dashboard-login',

  // Admin dashboard
  DASHBOARD: '/dashboard',
  COMPANY_USER: '/dashboard/company-user',
  COMPANY_USER_ADD: '/dashboard/company-user/add',
  COMPANY_USER_BLOCK: '/dashboard/company-user/block',
  COMPANY_USER_BLOCKED: '/dashboard/company-user/blocked',
  EMPLOYEE_USER: '/dashboard/employee-user',
  EMPLOYEE_USER_ADD: '/dashboard/employee-user/add',
  EMPLOYEE_USER_RECYCLE_REASON: '/dashboard/employee-user/recycle-reason',
  EMPLOYEE_USER_RECYCLE_BIN: '/dashboard/employee-user/recycle-bin',
  HELP_CENTER: '/dashboard/help-center',
  NOTIFICATIONS: '/dashboard/notifications',
  PROFILE: '/dashboard/profile',

  // Company dashboard
  COMPANY_DASHBOARD: '/company-dashboard',
  COMPANY_DASHBOARD_ASSET_CATEGORIES: '/company-dashboard/asset-categories',
  COMPANY_DASHBOARD_ASSETS: '/company-dashboard/assets',
  COMPANY_DASHBOARD_ASSETS_ADD: '/company-dashboard/assets/add',
  COMPANY_DASHBOARD_BRANCH: '/company-dashboard/branch-management',
  COMPANY_DASHBOARD_BRANCH_BLOCKED: '/company-dashboard/branch-management/blocked',
  COMPANY_DASHBOARD_DEPARTMENT: '/company-dashboard/department-management',
  COMPANY_DASHBOARD_ASSET_USAGE: '/company-dashboard/asset-usage',
  COMPANY_DASHBOARD_ASSET_TRANSFER: '/company-dashboard/asset-transfer',
  COMPANY_DASHBOARD_ASSET_DECOMMISSION: '/company-dashboard/asset-decommission',
  COMPANY_DASHBOARD_RECYCLE_BIN: '/company-dashboard/recycle-bin',
  COMPANY_DASHBOARD_HELP: '/company-dashboard/help-center',
  COMPANY_DASHBOARD_PROFILE: '/company-dashboard/profile',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

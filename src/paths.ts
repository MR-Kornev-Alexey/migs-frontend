export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password', inputMainOrganization:  '/auth/input-organization'  },
  dashboard: {
    overview: '/dashboard',
    customers: '/dashboard/customers',
    account: '/dashboard/account',
    charts: '/dashboard/charts',
    tables: '/dashboard/tables',
    integrations: '/dashboard/integrations',
    sensors: '/dashboard/sensors',
    terminal: '/dashboard/terminal',
    worklog: '/dashboard/worklog',
    manual: '/dashboard/manual',
    terms: '/dashboard/terms',
    settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;

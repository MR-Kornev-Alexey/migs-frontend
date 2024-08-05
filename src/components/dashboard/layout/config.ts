import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Главная', href: paths.dashboard.overview, icon: 'house' },
  { key: 'customers', title: 'Пользователи', href: paths.dashboard.customers, icon: 'users' },
  { key: 'charts', title: 'Графики', href: paths.dashboard.integrations, icon: 'chart-bar' },
  { key: 'tables', title: 'Таблицы', href: paths.dashboard.integrations, icon: 'table' },
  { key: 'sensors', title: 'Датчики', href: paths.dashboard.sensors, icon: 'plugs-connected' },
  { key: 'settings', title: 'Настройки', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Мой аккаунт', href: paths.dashboard.account, icon: 'user' },
  { key: 'manual', title: 'Руководство пользователя', href: paths.dashboard.manual, icon: 'notebook' },
  { key: 'error', title: 'Ошибки', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];

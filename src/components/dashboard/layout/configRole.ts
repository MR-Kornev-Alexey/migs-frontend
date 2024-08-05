import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths'; // Наборы пунктов навигации для различных ролей

const userNavItems = [
  { key: 'overview', title: 'Главная', href: paths.dashboard.overview, icon: 'home' },
  { key: 'account', title: 'Мой профиль', href: paths.dashboard.account, icon: 'user' },
  { key: 'charts', title: 'Графики', href: paths.dashboard.charts, icon: 'chart-bar' },
  { key: 'tables', title: 'Таблицы', href: paths.dashboard.tables, icon: 'table' },
  { key: 'sensors', title: 'Датчики', href: paths.dashboard.sensors, icon: 'plugs-connected' },
  { key: 'manual', title: 'Руководство пользователя', href: paths.dashboard.manual, icon: 'notebook' },
];

const dispatcherNavItems = [
  { key: 'overview', title: 'Главная', href: paths.dashboard.overview, icon: 'home' },
  { key: 'account', title: 'Мой профиль', href: paths.dashboard.account, icon: 'user' },
  { key: 'charts', title: 'Графики', href: paths.dashboard.charts, icon: 'chart-bar' },
  { key: 'tables', title: 'Таблицы', href: paths.dashboard.tables, icon: 'table' },
  { key: 'sensors', title: 'Датчики', href: paths.dashboard.sensors, icon: 'plugs-connected' },
  { key: 'worklog', title: 'Журнал работы', href: paths.dashboard.worklog, icon: 'log' },
  { key: 'manual', title: 'Руководство пользователя', href: paths.dashboard.manual, icon: 'notebook' },
];

const adminNavItems = [
  { key: 'overview', title: 'Главная', href: paths.dashboard.overview, icon: 'home' },
  { key: 'customers', title: 'Пользователи', href: paths.dashboard.customers, icon: 'users' },
  { key: 'account', title: 'Мой профиль', href: paths.dashboard.account, icon: 'user' },
  { key: 'charts', title: 'Графики', href: paths.dashboard.charts, icon: 'chart-bar' },
  { key: 'tables', title: 'Таблицы', href: paths.dashboard.tables, icon: 'table' },
  { key: 'sensors', title: 'Датчики', href: paths.dashboard.sensors, icon: 'plugs-connected' },
  { key: 'terminal', title: 'Консоль', href: paths.dashboard.terminal, icon: 'terminal' },
  { key: 'worklog', title: 'Журнал работы', href: paths.dashboard.worklog, icon: 'log' },
  { key: 'manual', title: 'Руководство пользователя', href: paths.dashboard.manual, icon: 'notebook' },
  { key: 'settings', title: 'Настройки', href: paths.dashboard.settings, icon: 'gear-six' },
];

const supervisorNavItems = [
  { key: 'overview', title: 'Главная', href: paths.dashboard.overview, icon: 'home' },
  { key: 'customers', title: 'Пользователи', href: paths.dashboard.customers, icon: 'users' },
  { key: 'account', title: 'Мой профиль', href: paths.dashboard.account, icon: 'user' },
  { key: 'charts', title: 'Графики', href: paths.dashboard.charts, icon: 'chart-bar' },
  { key: 'tables', title: 'Таблицы', href: paths.dashboard.tables, icon: 'table' },
  { key: 'sensors', title: 'Датчики', href: paths.dashboard.sensors, icon: 'plugs-connected' },
  { key: 'terminal', title: 'Консоль', href: paths.dashboard.terminal, icon: 'terminal' },
  { key: 'worklog', title: 'Журнал работы', href: paths.dashboard.worklog, icon: 'log' },
  { key: 'manual', title: 'Руководство пользователя', href: paths.dashboard.manual, icon: 'notebook' },
  { key: 'settings', title: 'Настройки', href: paths.dashboard.settings, icon: 'gear-six' },
];

// Определение функции, возвращающей пункты навигации в зависимости от роли
export const getNavItemsForRole = (role: string): NavItemConfig[] => {
  switch (role) {
    case 'admin':
      return adminNavItems;
    case 'user':
      return userNavItems;
    case 'dispatcher':
      return dispatcherNavItems;
    case 'supervisor':
      return supervisorNavItems;
    default:
      return userNavItems;
  }
};

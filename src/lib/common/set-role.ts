export default function setRole(role: string) {
  switch (role) {
    case 'admin':
      return 'Администратор';
    case 'user':
      return 'Пользователь';
    case 'dispatcher':
      return 'Диспетчер';
    case 'supervisor':
      return 'Супервайзер';
    default:
      return 'Пользователь';
  }
}

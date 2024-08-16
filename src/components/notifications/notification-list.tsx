import React from 'react';
import { Box, Typography } from '@mui/material';

// Определение типов для пропсов
interface Notification {
  id: string;
  object_id: string;
  created_at: string;
  information: string;
}

interface NotificationListProps {
  isNotifications: Notification[];
  findNameOfObject: (objectId: string) => string;
  formatDateTime: (dateTime: string) => string; // Или другой тип в зависимости от формата даты
}

function NotificationList({ isNotifications, findNameOfObject, formatDateTime }: NotificationListProps) {
  return (
    <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column' }}>
      {isNotifications.map((note) => (
        <Box key={note.id} sx={{ marginY: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ marginY: 1 }}>
            {findNameOfObject(note.object_id)}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            <Box sx={{ flexBasis: '20%' }}>
              <Typography variant="body2">{formatDateTime(note.created_at)}</Typography>
            </Box>
            <Box sx={{ flexBasis: '80%' }}>
              <Typography variant="body2">{note.information}</Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default NotificationList;

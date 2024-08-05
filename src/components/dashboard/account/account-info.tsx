import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import setRole from "@/lib/common/set-role";

export function AccountInfo({ dataUser }: any): React.JSX.Element {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <Avatar src="/assets/migs/user_avatar.png" sx={{ height: 80, width: 80 }} />
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{dataUser.name}</Typography>
            <Typography color="text.secondary" variant="body2">
              {dataUser.email}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {setRole(dataUser.role)}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {dataUser.organization.name}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

export default function CheckOrganisation({ initialData }): React.JSX.Element {
  const organizationEntries = Object.entries(initialData);
  return (
    <Stack spacing={3}>
      <Typography variant="h4" sx={{ textAlign: 'center' }}>
        Первичная организация введена
      </Typography>
      <Stack sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '600px' }}>
          <TableHead>
            <TableRow>
              <TableCell>№№</TableCell>
              <TableCell>Наименование</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {organizationEntries.map(([key, value], index:number) => (
              <TableRow key={key}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{value as React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | Iterable<React.ReactNode> | React.ReactPortal | boolean | undefined | null}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>
    </Stack>
  );
}

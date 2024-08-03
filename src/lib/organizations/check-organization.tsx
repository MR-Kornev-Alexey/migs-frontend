import * as React from 'react';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { Organization } from '@/types/result-api';

// Define the prop types for the component
interface CheckOrganisationProps {
  initialData: Organization;
}

export default function CheckOrganisation({ initialData }: CheckOrganisationProps): React.JSX.Element {
  // Convert initialData to an array of key-value pairs
  const organizationEntries: [string, string | number | undefined][] = Object.entries(initialData);

  return (
    <Stack spacing={3}>
      <Typography variant="h4" sx={{ textAlign: 'center' }}>
        Первичная организация загружена в базу данных
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
            {organizationEntries.map(([key, value], index) => (
              <TableRow key={key}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>
    </Stack>
  );
}

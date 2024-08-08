import * as React from 'react';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { GearFine } from '@phosphor-icons/react';

import setKindOfObject from '@/lib/common/kind-of-object';
import { TablePaginationActions } from '@/components/tables/table-pagination-actions';

// Define the TablePaginationActionsProps interface
interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

// Define the ObjectsPaginationActionsTableProps interface
interface ObjectsPaginationActionsTableProps {
  rows: any;
  selectObject: (id: string) => void;
}

export default function ObjectsPaginationActionsTable({ rows, selectObject }: ObjectsPaginationActionsTableProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Stack spacing={3}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell style={{ width: '20%' }} align="center">
                Адрес
              </TableCell>
              <TableCell style={{ width: '20%' }} align="center">
                Организация
              </TableCell>
              <TableCell style={{ width: '20%' }} align="center">
                Тип объекта
              </TableCell>
              <TableCell style={{ width: '20%' }} align="center">
                Датчики
              </TableCell>
              <TableCell style={{ width: '10%' }} align="center">
                <GearFine size={24} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map((row:any) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell style={{ width: '20%' }} align="center">
                  {row.address}
                </TableCell>
                <TableCell style={{ width: '20%' }} align="center">
                  {row?.organization?.name || "N/A"}
                </TableCell>
                <TableCell style={{ width: '20%' }} align="center">
                  {setKindOfObject(row.objectsType)}
                </TableCell>
                <TableCell style={{ width: '20%' }} align="center">
                  {row.Sensor.length}
                </TableCell>
                <TableCell
                  style={{ width: '10%', cursor: 'pointer' }}
                  align="center"
                  onClick={() => selectObject(row.id)}
                >
                  <GearFine size={24} />
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={6}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Stack>
  );
}

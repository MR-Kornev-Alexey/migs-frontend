import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Trash } from '@phosphor-icons/react';
import { UserGear } from '@phosphor-icons/react/dist/ssr/UserGear';

import setRole from '@/lib/common/set-role';
import { TablePaginationActions } from '@/components/tables/table-pagination-actions';


// Define the props interface for CustomTableWithoutSelect
interface CustomTableWithoutSelectProps {
  rows: any; // Update with actual type
  openModal?: () => void; // Optional, add if needed
  selectOrganization: (selected: any) => void;
  restoreAllOrganization: () => void;
  page: number;
  setPage: (id: any) => void;
  deleteCustomer: (id: any) => void;
  infoAboutCustomer: (row: any) => Promise<any>;
}
export default function CustomTableWithoutSelect({
  rows,
  selectOrganization,
  deleteCustomer,
  infoAboutCustomer,
  page,
  setPage,
}:CustomTableWithoutSelectProps) {
  // Удалите локальное состояние page
  const [isButtonClear, setIsButtonClear] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage); // Используйте setPage из пропсов для обновления состояния в родительском компоненте
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Организация</TableCell>
            <TableCell>Username</TableCell>
            <TableCell style={{ width: '20%' }} align="center">
              Email
            </TableCell>
            <TableCell style={{ width: '20%' }} align="center">
              Статус
            </TableCell>
            <TableCell style={{ width: '5%' }} align="center">
              Подробнее
            </TableCell>
            <TableCell style={{ width: '5%' }} align="center">
              Удалить
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map((row:any) => {
            return (
              <TableRow key={row.id}>
                <TableCell
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    selectOrganization(row.organization_id);
                    setIsButtonClear(true);
                  }}
                >
                  {row.organization.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell style={{ width: '20%' }} align="center">
                  {row.email}
                </TableCell>
                <TableCell style={{ width: '20%' }} align="center">
                  {setRole(row.role)}
                </TableCell>
                <TableCell
                  style={{ width: '5%', cursor: 'pointer' }}
                  align="center"
                  onClick={() => infoAboutCustomer(row)}
                >
                  <UserGear size={24} />
                </TableCell>
                <TableCell
                  style={{ width: '5%', cursor: 'pointer' }}
                  align="center"
                  onClick={() => deleteCustomer(row.id)}
                >
                  <Trash size={24} />
                </TableCell>
              </TableRow>
            );
          })}
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
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

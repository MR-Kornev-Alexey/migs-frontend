import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {GearFine, HandTap} from '@phosphor-icons/react';

import setKindOfObject from '@/lib/common/kind-of-object';
import { TablePaginationActions } from '@/components/tables/table-pagination-actions';

interface ObjectsPaginationActionsTableProps {
  rows: any;
  selectOneObjectForInfo: (id: string) => void;
  selectOneObjectForTable: (id: string) => void;
}

export default function ObjectsPaginationActionsTable({ rows, selectOneObjectForInfo , selectOneObjectForTable}: ObjectsPaginationActionsTableProps) {
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
              <TableCell style={{ width: '5%'}} align="center">Выбрать</TableCell>
              <TableCell>Название</TableCell>
              <TableCell  align="center">
                Адрес
              </TableCell>
              <TableCell align="center">
                Организация
              </TableCell>
              <TableCell style={{ width: '20%' }} align="center">
                Тип объекта
              </TableCell>
              <TableCell style={{ width: '10%' }} align="center">
                Датчики
              </TableCell>
              <TableCell style={{ width: '10%' ,  cursor: "pointer" }} align="center">
                Подробно
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map((row:any) => (
              <TableRow key={row.id}>
                <TableCell style={{ width: '5%',  cursor: "pointer" }} align="center"
                           onClick={() => { selectOneObjectForTable(row.id); }}
                ><HandTap size={24} /></TableCell>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell  align="center">
                  {row.address}
                </TableCell>
                <TableCell align="center">
                  {row?.organization?.name || "N/A"}
                </TableCell>
                <TableCell style={{ width: '20%' }} align="center">
                  {setKindOfObject(row.objectsType)}
                </TableCell>
                <TableCell style={{ width: '10%' }} align="center">
                  {row.Sensor.length}
                </TableCell>
                <TableCell
                  style={{ width: '10%', cursor: 'pointer' }}
                  align="center"
                  onClick={() => { selectOneObjectForInfo(row.id); }}
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
          <TableFooter sx={{display: 'flex', justifyContent: 'left'}}>
            <TableRow >
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={6}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      'aria-label': 'Объектов на страницу',
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                labelRowsPerPage="Объектов на странице:" // Custom label
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Stack>
  );
}

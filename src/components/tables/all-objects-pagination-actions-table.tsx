import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { CheckSquareOffset, GearFine } from '@phosphor-icons/react';

import { useSelection } from '@/hooks/use-selection';
import { TablePaginationActions } from '@/components/tables/table-pagination-actions';
import setKindOfObject from "@/lib/common/kind-of-object";


interface AllObjectsPaginationActionsTableProps {
  rows: any;
  onSelectedRowsChange: (id: any) => void; // Function type adjusted here
}

export default function AllObjectsPaginationActionsTable({ rows, onSelectedRowsChange }: AllObjectsPaginationActionsTableProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const rowIds = React.useMemo(() => {
    return rows.map((customer:any) => customer.id);
  }, [rows]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  React.useEffect(() => {
    onSelectedRowsChange(selected);
  }, [selected]);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
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
            <TableCell padding="checkbox">
              <Checkbox
                checked={selectedAll}
                indeterminate={selectedSome}
                onChange={(event) => {
                  if (event.target.checked) {
                    selectAll();
                  } else {
                    deselectAll();
                  }
                }}
              />
            </TableCell>
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
            <TableCell style={{ width: '5%' }} align="center">
              Датчики
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map((row:any) => {
            const isSelected = selected?.has(row.id);
            return (
              <TableRow key={row.id} selected={isSelected}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    onChange={(event) => {
                      if (event.target.checked) {
                        selectOne(row.id);
                      } else {
                        deselectOne(row.id);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell style={{ width: '10%' }} align="center">
                  {row.address}
                </TableCell>
                <TableCell align="center">
                  {row?.organization?.name || "N/A"}
                </TableCell>
                <TableCell
                  align="center"
                >
                  {setKindOfObject(row.objectsType)}
                </TableCell>
                <TableCell align="center">
                  {row.Sensor.length}
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
        <TableFooter sx={{display: 'flex', justifyContent: 'left'}}>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
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
              labelRowsPerPage="Cтрок на странице:" // Custom label
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

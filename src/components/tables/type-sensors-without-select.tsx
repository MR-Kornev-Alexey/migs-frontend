import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { PlusSquare } from '@phosphor-icons/react';
import { TablePaginationActions } from '@/components/tables/table-pagination-actions';

// Define types for the sensor model and the props
interface SensorModel {
  id: string;
  sensor_type: string;
  sensor_key: string;
  models: string[];
}

interface TypeSensorsWithoutSelectProps {
  rows: SensorModel[];
  openModalNewModel: (params: { sensorKey: string; sensorType: string }) => void;
}

export default function TypeSensorsWithoutSelect({ rows, openModalNewModel }: TypeSensorsWithoutSelectProps) {
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 300 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '20%' }}>Тип датчика</TableCell>
            <TableCell>Модели</TableCell>
            <TableCell style={{ width: '10%' }} align="center">
              Добавить модель
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map((row) => {
            return (
              <TableRow key={row.id}>
                <TableCell style={{ width: '20%' }}>{row.sensor_type}</TableCell>
                <TableCell sx={{ display: 'flex', justifyContent: 'space-around' }}>
                  {row.models.map((item, index) => (
                    <Box key={index}>{item}</Box>
                  ))}
                </TableCell>
                <TableCell
                  style={{ width: '10%', cursor: 'pointer' }}
                  align="center"
                  onClick={() => openModalNewModel({ sensorKey: row.sensor_key, sensorType: row.sensor_type })}
                >
                  <PlusSquare size={24} />
                </TableCell>
              </TableRow>
            );
          })}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={3} />
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

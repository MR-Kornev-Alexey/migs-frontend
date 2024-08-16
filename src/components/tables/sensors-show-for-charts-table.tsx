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
import {BellSimpleRinging, GearFine} from '@phosphor-icons/react';
import {SvgSpinnersBarsScale} from '@/components/animated-icon/chart-icon';
import {LineMdPlayFilledToPauseTransition} from '@/components/animated-icon/pause-icon';
import {TablePaginationActions} from '@/components/tables/table-pagination-actions';
import calcEmptyRows from '@/components/tables/empty-rows';
import {SensorInfo} from "@/types/sensor";
import {NewSensor} from "@/types/common-types";
import Box from "@mui/material/Box";

interface SensorsShowForChartsTableProps {
  rows: NewSensor[];
  page: number;
  setPage: (page: number) => void;
  openAddInfoAboutSensors: ({sensor_id}: any) => void;
}

const SensorsShowForChartsTable: React.FC<SensorsShowForChartsTableProps> = ({
                                                                               rows,
                                                                               page,
                                                                               setPage,
                                                                               openAddInfoAboutSensors
                                                                             }) => {
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const emptyRows: number = calcEmptyRows(page, rowsPerPage, rows);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 600}} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell  align="center">Наименование</TableCell>
            <TableCell  align="center">Сетевой номер</TableCell>
            <TableCell  align="center">Активность</TableCell>
            <TableCell align="center">Последнее базовое значение</TableCell>
            <TableCell align="center">Логический ноль</TableCell>
            <TableCell  align="center">Максимальное базовое значение</TableCell>
            <TableCell align="center">Минимальное базовое значение</TableCell>
            <TableCell align="center">Сигнализация</TableCell>
            <TableCell align="center">Подробнее</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map(
            (row, index) => {
              const isEvenRow = (index + 1) % 2 === 0; // Check if the row is even
              return (
                <TableRow key={row.id} sx={{backgroundColor: isEvenRow ? '#d9d9d9' : 'inherit'}}>
                  <TableCell  align="center">{row.model} | {row.designation} </TableCell>
                  <TableCell  align="center">{row.network_number}</TableCell>
                  <TableCell
                    style={{textAlign: 'center'}}
                  >
                    {row.run ? <SvgSpinnersBarsScale/> : <LineMdPlayFilledToPauseTransition/>}
                  </TableCell>
                  <TableCell  align="center">
                    {row.requestSensorInfo[0] ? row.requestSensorInfo[0].last_base_value : 0}
                  </TableCell>
                  <TableCell  align="center">
                    {row.requestSensorInfo[0] ? row.requestSensorInfo[0].base_zero : 0}
                  </TableCell>
                  <TableCell  align="center">
                    {row.requestSensorInfo[0] ? row.requestSensorInfo[0].max_base : 0}
                  </TableCell>
                  <TableCell align="center">
                    {row.requestSensorInfo[0] ? row.requestSensorInfo[0].min_base : 0}
                  </TableCell>
                  <TableCell align="center">
                    {row.requestSensorInfo[0] ? <Box>
                      {row.requestSensorInfo[0].warning ?  <BellSimpleRinging  color={"#9f093e"} size={24} /> :    <LineMdPlayFilledToPauseTransition/>}
                    </Box>:<Box>
                      <LineMdPlayFilledToPauseTransition/>
                    </Box> }
                  </TableCell>
                  <TableCell
                    style={{cursor: 'pointer'}}
                    align="center"
                    onClick={() => {
                      openAddInfoAboutSensors(row.id);
                    }}
                  >
                    <GearFine size={24}/>
                  </TableCell>
                </TableRow>
              );
            }
          )}
          {emptyRows > 0 && (
            <TableRow style={{height: 33 * emptyRows}}>
              <TableCell colSpan={6}/>
            </TableRow>
          )}
        </TableBody>
        <TableFooter sx={{display: 'flex', justifyContent: 'left'}}>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, {label: 'All', value: -1}]}
              colSpan={10}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
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
};

export default SensorsShowForChartsTable;

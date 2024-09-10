import * as React from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography, TablePagination } from '@mui/material';
import * as XLSX from 'xlsx';
import parseSensorInD3 from '@/lib/parse-sensor/parse-sensor-in-d3';
import formatDateTime from "@/lib/common/format-date-time";
import { TablePaginationActions } from '@/components/tables/table-pagination-actions';
import transliterateAndReplaceSpaces from "@/lib/common/transliterate-and-replace-spaces";

interface SensorInfo {
  sensor_type: string;
  model: string;
  designation: string;
  coefficient: number;
  limitValue: number;
}

interface SensorDataInclinoMeterProps {
  rows: {
    request_code: string;
    answer_code: string;
    created_at: string;
  }[];
  sensorInfo: SensorInfo[];
}

const SensorDataInclinoMeter: React.FC<SensorDataInclinoMeterProps> = ({ rows, sensorInfo }) => {
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(0);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExportIND3 = () => {
    const exportData = rows.map((row, index) => {
      const parsedData = parseSensorInD3(row.answer_code, sensorInfo[0].coefficient, sensorInfo[0].limitValue);
      return {
        '№№': index + 1,
        'Дата': formatDateTime(row.created_at),
        'Запрос': row.request_code,
        'Ответ': row.answer_code,
        'Значение Y': parsedData.angleY,
        'Значение X': parsedData.angleX,
        'Модуль': parsedData.magnitude,
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, transliterateAndReplaceSpaces(`data-from-${sensorInfo[0].sensor_type}-${sensorInfo[0].model}-${sensorInfo[0].designation}.xlsx`));
  };

  return (
    <Box sx={{ marginY: 2 }}>
      <Typography sx={{ marginY: 2 }} variant="h6">
        {sensorInfo[0].sensor_type} {sensorInfo[0].model} {sensorInfo[0].designation}
      </Typography>
      <Button variant="contained" onClick={handleExportIND3} sx={{ marginY: 2 }}>
        Export to Excel
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 300 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '5%' }}>№№</TableCell>
              <TableCell style={{ width: '20%' }}>Дата</TableCell>
              <TableCell>Запрос</TableCell>
              <TableCell align="center">Ответ</TableCell>
              <TableCell align="center">Значение Y</TableCell>
              <TableCell align="center">Значение X</TableCell>
              <TableCell align="center">Модуль</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              const parsedData = parseSensorInD3(row.answer_code, sensorInfo[0].coefficient, sensorInfo[0].limitValue);
              return (
                <TableRow key={index}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{formatDateTime(row.created_at)}</TableCell>
                  <TableCell>{row.request_code}</TableCell>
                  <TableCell align="center">{row.answer_code.length <= 24 ? row.answer_code : 'Ошибка'}</TableCell>
                  <TableCell align="center">{parsedData.angleY}</TableCell>
                  <TableCell align="center">{parsedData.angleX}</TableCell>
                  <TableCell align="center">{parsedData.magnitude}</TableCell>
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={7}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                labelRowsPerPage="Данные на странице:"
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SensorDataInclinoMeter;

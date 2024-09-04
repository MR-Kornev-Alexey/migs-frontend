import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import * as XLSX from 'xlsx';
import parseSensorRf251 from '@/lib/parse-sensor/parse-sensor-rf251';
import formatDateTime from "@/lib/common/format-date-time";
import { TablePaginationActions } from "@/components/tables/table-pagination-actions";
import hexToAsciiAndConvert from "@/lib/parse-sensor/hex-to-ascii-and-convert-for-ls5";


interface SensorDataStrainGaugeProps {
  rows: any[];
  sensorInfo: string []; // Assumes [sensorType, model, designation]
}

const SensorDataStrainGauge: React.FC<SensorDataStrainGaugeProps> = ({ rows, sensorInfo }) => {
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(0);

  // Calculate empty rows for pagination
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  // Handle page change
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // Function to check the sensor's answer code
  const checkAnswerCode = (code: string): string => {
    if (code.length === 28) {
      return code.replace(/(.{2})/g, '$1 ').trim();
    } else if (code.length >= 22 && code.length !== 28) {
      // Обрезаем строку до 22 символов, если её длина больше 22
      const truncatedCode = code.slice(0, 22);
      return truncatedCode.replace(/(.{2})/g, '$1 ').trim();
    } else if (code.length === 0) {
      return 'Потеря ответа датчика';
    }

    return 'Ошибка ответа датчика';
  };

  // Handle exporting data to Excel
  const handleExportStrainGauge = () => {
    const exportData = rows.map((row, index) => ({
      '№№': index + 1,
      'Дата': formatDateTime(row.created_at),
      'Запрос': row.request_code,
      'Ответ': checkAnswerCode(row.answer_code),
      'Фактическое отклонение (мкр)': parseSensorRf251(row.answer_code,1, 3000).distance,
      'Температура (градус)': parseSensorRf251(row.answer_code,1, 3000).temperature,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'strain_gauge_data.xlsx');
  };

  return (
    <Box sx={{marginY:2}}>
      <Typography variant="h6">
        {sensorInfo[0]} {sensorInfo[1]} {sensorInfo[2]}
      </Typography>
      <Button variant="contained" onClick={handleExportStrainGauge} sx={{ marginY: 2 }}>
        Export to Excel
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 300 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '2%' }} />
              <TableCell style={{ width: '20%' }}>Дата</TableCell>
              <TableCell>Запрос</TableCell>
              <TableCell align="center">Ответ</TableCell>
              <TableCell align="center">Фактическое отклонение (мкр)</TableCell>
              {sensorInfo[1] === "РФ-251" && <TableCell align="center">Температура (градус)
              </TableCell>
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : rows
            ).map((row, index) => {
              const isEvenRow = (index + 1) % 2 === 0; // Check if the row is even
              let parsedDataRF;
              let parsedDataLS5;
              if(sensorInfo[1] === "РФ-251") {
                parsedDataRF = parseSensorRf251(row.answer_code,1,3000);
              } else {
                parsedDataLS5 = hexToAsciiAndConvert(row.answer_code,1, 3000);
              }
              return (
                <TableRow key={index} sx={{ backgroundColor: isEvenRow ? '#d9d9d9' : 'inherit' }}>
                  <TableCell style={{ width: '2%' }}>{index + 1 }</TableCell>
                  <TableCell>{formatDateTime(row.created_at)}</TableCell>
                  <TableCell>{row.request_code}</TableCell>
                  <TableCell style={{ cursor: 'pointer' }} align="center">
                    {checkAnswerCode(row.answer_code)}
                  </TableCell>
                  <TableCell align="center">
                    {sensorInfo[1] === "РФ-251" ? (parsedDataRF?.distance ?? 0) : (parsedDataLS5 || 0)}
                  </TableCell>
                  {sensorInfo[1] === "РФ-251" && (
                    <TableCell align="center">
                      {parsedDataRF?.temperature ?? "N/A"}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter sx={{ display: 'flex', justifyContent: 'left' }}>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={5}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                labelRowsPerPage="Данные на странице:" // Custom label
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SensorDataStrainGauge;

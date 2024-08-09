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
import TextField from '@mui/material/TextField';
import { CopySimple, GearFine, Trash } from '@phosphor-icons/react';
import { SvgSpinnersBarsScale } from '@/components/animated-icon/chart-icon';
import { LineMdPlayFilledToPauseTransition } from '@/components/animated-icon/pause-icon';
import { TablePaginationActions } from '@/components/tables/table-pagination-actions';
import calcEmptyRows from '@/components/tables/empty-rows';
import {Row} from "@/types/row";

// Define the props interface
interface SensorsPaginationAndSelectTableProps {
  rows: Row[];
  page: number;
  setPage: (page: number) => void;
  selectObject: (selected: any) => void;
  openAddInfoAboutSensors: (id: string) => void;
  handleChangeIpAddress: (id: string, ipAddress: string) => void;
  sendIdForCopy: (id: string) => void;
  deleteOneSensor: (id: string) => void;
  handleChangeStatus: (id: string) => void;
  handleChangeNetAddress: (id: string, networkNumber: string)  => void;
  updateSensorDesignation: (id: string, newDesignation: string) => void;
}

const SensorsPaginationAndSelectTable: React.FC<SensorsPaginationAndSelectTableProps> = ({
                                                                                           rows,
                                                                                           page,
                                                                                           setPage,
                                                                                           selectObject,
                                                                                           handleChangeIpAddress,
                                                                                           sendIdForCopy,
                                                                                           deleteOneSensor,
                                                                                           handleChangeStatus,
                                                                                           handleChangeNetAddress,
                                                                                           updateSensorDesignation,
                                                                                           openAddInfoAboutSensors
                                                                                         }) => {
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [editableDesignation, setEditableDesignation] = React.useState<{ rowId: string | null; value: string }>({
    rowId: null,
    value: '',
  });

  const [editableIpAddress, setEditableIpAddress] = React.useState<{ rowId: string | null; value: string }>({
    rowId: null,
    value: '',
  });

  const [editableNetAddress, setEditableNetAddress] = React.useState<{ rowId: string | null; value: string }>({
    rowId: null,
    value: '',
  });

  const handleDesignationClick = (rowId: string, currentValue: string) => {
    setEditableDesignation({ rowId, value: currentValue });
  };

  const handleIpAddressClick = (rowId: string, currentValue: string) => {
    setEditableIpAddress({ rowId, value: currentValue });
  };

  const handleNetAddressClick = (rowId: string, currentValue: string) => {
    setEditableNetAddress({ rowId, value: currentValue });
  };


  const handleDesignationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditableDesignation({ ...editableDesignation, value: event.target.value });
  };

  const handleIpAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditableIpAddress({ ...editableIpAddress, value: event.target.value });
  };
  const handleNetAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditableNetAddress({ ...editableNetAddress, value: event.target.value });
  };


  const handleDesignationBlur = (rowId: string) => {
    updateSensorDesignation(rowId, editableDesignation.value);
    setEditableDesignation({ rowId: null, value: '' });
  };

  const handleIpAddressBlur = (rowId: string) => {
    handleChangeIpAddress(rowId, editableIpAddress.value);
    setEditableIpAddress({ rowId: null, value: '' });
  };

  const handleNetAddressBlur = (rowId: string) => {
    handleChangeNetAddress(rowId, editableNetAddress.value);
    setEditableNetAddress({ rowId: null, value: '' });
  };

  const handleDesignationKeyPress = (event: React.KeyboardEvent<HTMLDivElement>, rowId: string) => {
    if (event.key === 'Enter') {
      handleDesignationBlur(rowId);
    }
  };

  const handleIpAddressKeyPress = (event: React.KeyboardEvent<HTMLDivElement>, rowId: string) => {
    if (event.key === 'Enter') {
      handleIpAddressBlur(rowId);
    }
  };
  const handleNetAddressKeyPress = (event: React.KeyboardEvent<HTMLDivElement>, rowId: string) => {
    if (event.key === 'Enter') {
      handleNetAddressBlur(rowId);
    }
  };

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
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell >Объект</TableCell>
            <TableCell style={{ width: '10%' }}>ip - адрес</TableCell>
            <TableCell style={{ width: '10%' }}>Активность</TableCell>
            <TableCell style={{ width: '15%' }} align="center">
              Тип датчика
            </TableCell>
            <TableCell style={{ width: '12%' }} align="center">
              Марка датчика
            </TableCell>
            <TableCell style={{ width: '7%' }} align="center">
              Обозначение
            </TableCell>
            <TableCell align="center">Сетевой номер</TableCell>
            <TableCell align="center">Подробнее</TableCell>
            <TableCell align="center">Дублировать</TableCell>
            <TableCell align="center">Удалить</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map(
            (row, index) => {
              const isEvenRow = (index + 1) % 2 === 0; // Check if the row is even
              return (
                <TableRow key={row.id} sx={{ backgroundColor: isEvenRow ? '#d9d9d9' : 'inherit' }}>
                  <TableCell
                    sx={{ cursor: 'pointer'}}
                    onClick={() => {
                      selectObject(row.object.id);
                    }}
                  >
                    {row.object.name} | {row.object.address}
                  </TableCell>
                  <TableCell
                    style={{ width: '7%', cursor: 'pointer' }}
                    align="center"
                    onClick={() => handleIpAddressClick(row.id, row.ip_address)}
                  >
                    {editableIpAddress.rowId === row.id ? (
                      <TextField
                        value={editableIpAddress.value}
                        onChange={handleIpAddressChange}
                        onBlur={() => handleIpAddressBlur(row.id)}
                        onKeyPress={(event) => handleIpAddressKeyPress(event, row.id)}
                        autoFocus
                        aria-label="IP Address"
                      />
                    ) : (
                      row.ip_address
                    )}
                  </TableCell>
                  <TableCell
                    style={{ width: '10%', cursor: 'pointer', textAlign: 'center' }}
                    onClick={() => handleChangeStatus(row.id)}
                  >
                    {row.run ? <SvgSpinnersBarsScale /> : <LineMdPlayFilledToPauseTransition />}
                  </TableCell>
                  <TableCell style={{ width: '15%' }} align="center">
                    {row.sensor_type}
                  </TableCell>
                  <TableCell style={{ width: '12%' }} align="center">
                    {row.model}
                  </TableCell>
                  <TableCell
                    style={{ width: '7%', cursor: 'pointer' }}
                    align="center"
                    onClick={() => handleDesignationClick(row.id, row.designation)}
                  >
                    {editableDesignation.rowId === row.id ? (
                      <TextField
                        value={editableDesignation.value}
                        onChange={handleDesignationChange}
                        onBlur={() => handleDesignationBlur(row.id)}
                        onKeyPress={(event) => handleDesignationKeyPress(event, row.id)}
                        autoFocus
                        aria-label="Designation"
                      />
                    ) : (
                      row.designation
                    )}
                  </TableCell>
                  <TableCell
                    style={{ width: '7%', cursor: 'pointer' }}
                    align="center"
                    onClick={() => handleNetAddressClick(row.id, row.network_number)}
                  >
                    {editableNetAddress.rowId === row.id ? (
                      <TextField
                        value={editableNetAddress.value}
                        onChange={handleNetAddressChange}
                        onBlur={() => handleNetAddressBlur(row.id)}
                        onKeyPress={(event) => handleNetAddressKeyPress(event, row.id)}
                        autoFocus
                        aria-label="Net Address"
                      />
                    ) : (
                      row.network_number
                    )}
                  </TableCell>
                  <TableCell
                    style={{ cursor: 'pointer' }}
                    align="center"
                    onClick={() => {
                      openAddInfoAboutSensors(row.id);
                    }}
                  >
                    <GearFine size={24} />
                  </TableCell>
                  <TableCell
                    style={{ cursor: 'pointer' }}
                    align="center"
                    onClick={() => {
                      sendIdForCopy(row.id);
                    }}
                  >
                    <CopySimple size={32} />
                  </TableCell>
                  <TableCell
                    style={{ cursor: 'pointer' }}
                    align="center"
                    onClick={() => {
                      deleteOneSensor(row.id);
                    }}
                  >
                    <Trash size={24} />
                  </TableCell>
                </TableRow>
              );
            }
          )}
          {emptyRows > 0 && (
            <TableRow style={{ height: 33 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter sx={{display: 'flex', justifyContent: 'left'}}>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={10}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
              labelRowsPerPage="строк на странице:" // Custom label
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default SensorsPaginationAndSelectTable;

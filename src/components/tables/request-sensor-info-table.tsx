import React, {useState} from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Switch,
} from '@mui/material';
import {type SensorInfo} from "@/types/sensor";
import {PlayPause, Siren} from "@phosphor-icons/react";
import {BorderClear} from "@mui/icons-material";
import Box from "@mui/material/Box";

interface RequestSensorInfoTableProps {
  dataOfSensor: SensorInfo;
  updateRequestDataForSensors: (newValue: any, key: string) => void;
  mainUser: string;
}

const RequestSensorInfoTable: React.FC<RequestSensorInfoTableProps> = ({
                                                                         mainUser,
                                                                         dataOfSensor,
                                                                         updateRequestDataForSensors
                                                                       }) => {
  const [editableRequestCode, setEditableRequestCode] = useState<string | null>(null);
  const [editablePeriodicity, setEditablePeriodicity] = useState<number | null>(null);
  const [warningState, setWarningState] = useState<boolean>(dataOfSensor?.requestSensorInfo[0]?.warning || false);
  const [editableMinBase, setEditableMinBase] = useState<number | null>(null);
  const [editableMaxBase, setEditableMaxBase] = useState<number | null>(null);

  // Handlers for request_code
  const handleRequestCodeClick = () => {
    setEditableRequestCode(dataOfSensor?.requestSensorInfo[0]?.request_code || '');
  };

  const handleRequestCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditableRequestCode(event.target.value);
  };

  const handleRequestCodeBlur = () => {
    if (editableRequestCode !== null) {
      updateRequestDataForSensors(editableRequestCode, 'request_code');
      setEditableRequestCode(null);
    }
  };

  const handleRequestCodeKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleRequestCodeBlur();
    }
  };

  // Handlers for periodicity
  const handlePeriodicityClick = () => {
    setEditablePeriodicity(dataOfSensor?.requestSensorInfo[0]?.periodicity || 0);
  };

  const handlePeriodicityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditablePeriodicity(Number(event.target.value));
  };

  const handlePeriodicityBlur = () => {
    if (editablePeriodicity !== null) {
      updateRequestDataForSensors(editablePeriodicity, 'periodicity');
      setEditablePeriodicity(null);
    }
  };

  const handlePeriodicityKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handlePeriodicityBlur();
    }
  };

  // Handlers for base_zero

  // Handlers for min_base
  const handleMinBaseClick = () => {
    setEditableMinBase(dataOfSensor?.requestSensorInfo[0]?.min_base || 0);
  };

  const handleMinBaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditableMinBase(Number(event.target.value));
  };

  const handleMinBaseBlur = () => {
    if (editableMinBase !== null) {
      updateRequestDataForSensors(editableMinBase, 'min_base');
      setEditableMinBase(null);
    }
  };

  const handleMinBaseKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleMinBaseBlur();
    }
  };

  // Handlers for max_base
  const handleMaxBaseClick = () => {
    setEditableMaxBase(dataOfSensor?.requestSensorInfo[0]?.max_base || 0);
  };

  const handleMaxBaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditableMaxBase(Number(event.target.value));
  };

  const handleMaxBaseBlur = () => {
    if (editableMaxBase !== null) {
      updateRequestDataForSensors(editableMaxBase, 'max_base');
      setEditableMaxBase(null);
    }
  };

  const handleMaxBaseKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleMaxBaseBlur();
    }
  };

  // Handlers for warning (switch)
  const handleWarningChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newWarningValue = event.target.checked;
    setWarningState(newWarningValue);
    updateRequestDataForSensors(newWarningValue, 'warning');
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 500}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{textAlign: 'center'}}>Код запроса</TableCell>
            <TableCell style={{textAlign: 'center'}}>Периодичность<br/>запроса <sup>&#8432;</sup></TableCell>
            <TableCell style={{textAlign: 'center'}}>Последнее<br/>базовое значение</TableCell>
            <TableCell
              style={{textAlign: 'center'}}>Логический<br/>ноль <sup>&#8432;&nbsp;&nbsp;&#8432;</sup></TableCell>
            <TableCell style={{textAlign: 'center'}}>Минимальное<br/>базовое значение</TableCell>
            <TableCell style={{textAlign: 'center'}}>Максимальное<br/>базовое значение</TableCell>
            <TableCell style={{textAlign: 'center'}}>Контроль<br/>оповещения</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell
              style={{
                cursor: mainUser && (JSON.parse(mainUser).role !== 'customer' && JSON.parse(mainUser).role !== 'dispatcher')
                  ? 'pointer'
                  : 'not-allowed',
              }}
              align="center"
              onClick={() => {
                if (mainUser && (JSON.parse(mainUser).role !== 'customer' && JSON.parse(mainUser).role !== 'dispatcher')) {
                  handleRequestCodeClick();
                }
              }}
            >
              {editableRequestCode !== null ? (
                <TextField
                  value={editableRequestCode}
                  onChange={handleRequestCodeChange}
                  onBlur={handleRequestCodeBlur}
                  onKeyPress={handleRequestCodeKeyPress}
                  autoFocus
                  aria-label="request_code"
                />
              ) : (
                dataOfSensor?.requestSensorInfo[0]?.request_code
              )}
            </TableCell>
            <TableCell
              style={{
                cursor: mainUser && (JSON.parse(mainUser).role !== 'customer' && JSON.parse(mainUser).role !== 'dispatcher')
                  ? 'pointer'
                  : 'not-allowed'
              }}
              align="center"
              onClick={() => {
                if (mainUser && (JSON.parse(mainUser).role !== 'customer' && JSON.parse(mainUser).role !== 'dispatcher')) {
                  handlePeriodicityClick();
                }
              }}
            >
              {editablePeriodicity !== null ? (
                <TextField
                  value={editablePeriodicity}
                  onChange={handlePeriodicityChange}
                  onBlur={handlePeriodicityBlur}
                  onKeyPress={handlePeriodicityKeyPress}
                  autoFocus
                  aria-label="periodicity"
                  type="number"
                />
              ) : (
                dataOfSensor?.requestSensorInfo[0]?.periodicity
              )}
            </TableCell>
            <TableCell style={{textAlign: 'center'}}>
              {dataOfSensor?.requestSensorInfo[0]?.last_base_value}
            </TableCell>
            <TableCell align="center">
              {dataOfSensor?.requestSensorInfo[0]?.base_zero}
            </TableCell>
            <TableCell
              style={{
                cursor: mainUser && (JSON.parse(mainUser).role !== 'customer' && JSON.parse(mainUser).role !== 'dispatcher')
                  ? 'pointer'
                  : 'not-allowed',
              }}
              align="center"
              onClick={() => {
                if (mainUser && (JSON.parse(mainUser).role !== 'customer' && JSON.parse(mainUser).role !== 'dispatcher')) {
                  handleMinBaseClick();
                }
              }}
            >
              {editableMinBase !== null ? (
                <TextField
                  value={editableMinBase}
                  onChange={handleMinBaseChange}
                  onBlur={handleMinBaseBlur}
                  onKeyPress={handleMinBaseKeyPress}
                  autoFocus
                  aria-label="min_base"
                  type="number"
                />
              ) : (
                dataOfSensor?.requestSensorInfo[0]?.min_base
              )}
            </TableCell>
            <TableCell
              style={{
                cursor: mainUser && (JSON.parse(mainUser).role !== 'customer' && JSON.parse(mainUser).role !== 'dispatcher')
                  ? 'pointer'
                  : 'not-allowed'
              }}
              align="center"
              onClick={() => {
                if (mainUser && (JSON.parse(mainUser).role !== 'customer' && JSON.parse(mainUser).role !== 'dispatcher')) {
                  handleMaxBaseClick();
                }
              }}
            >
              {editableMaxBase !== null ? (
                <TextField
                  value={editableMaxBase}
                  onChange={handleMaxBaseChange}
                  onBlur={handleMaxBaseBlur}
                  onKeyPress={handleMaxBaseKeyPress}
                  autoFocus
                  aria-label="max_base"
                  type="number"
                />
              ) : (
                dataOfSensor?.requestSensorInfo[0]?.max_base
              )}
            </TableCell>
            <TableCell style={{
              cursor: mainUser && (JSON.parse(mainUser).role !== 'customer' && JSON.parse(mainUser).role !== 'dispatcher')
                ? 'pointer'
                : 'not-allowed',
            }} align="center">
              {mainUser && (JSON.parse(mainUser).role !== 'customer' && JSON.parse(mainUser).role !== 'dispatcher') ?
                <Switch
                  checked={warningState}
                  onChange={handleWarningChange}
                  color="primary"
                /> : <Box>Нет доступа</Box>
              }
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequestSensorInfoTable;

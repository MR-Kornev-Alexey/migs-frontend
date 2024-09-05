import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField, Switch,
} from '@mui/material';
import {Article, ThumbsDown, ThumbsUp} from '@phosphor-icons/react';
import { SvgSpinnersBarsScale } from '@/components/animated-icon/chart-icon';
import { LineMdPlayFilledToPauseTransition } from '@/components/animated-icon/pause-icon';
import { type SensorInfo } from "@/types/sensor";

interface MainSensorDataTableProps {
  dataOfSensor: SensorInfo;
  openModalErrorInfoSensor: () => void;
  updateAdditionalDataForSensors: (newNote: string, parameter: string) => void;
  updateNullDataForObject: (object_id: string , parameter: boolean) => void;
}

const MainSensorDataTable: React.FC<MainSensorDataTableProps> = ({ dataOfSensor, openModalErrorInfoSensor, updateAdditionalDataForSensors, updateNullDataForObject }) => {
  // Initialize editableNote with the current notation value
  const [editableNote, setEditableNote] = useState<string | null>(null);
  const [nullState, setNullState] = useState<boolean>(dataOfSensor?.object?.set_null || false);

  const handleNoteChangeClick = () => {
    // Set editableNote to current notation to start editing
    setEditableNote(dataOfSensor.notation);
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditableNote(event.target.value);
  };

  const handleNoteBlur = () => {
    if (editableNote !== null) {
      updateAdditionalDataForSensors(editableNote, 'notation');
      setEditableNote(null); // Reset to non-edit mode
    }
  };

  const handleNoteKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleNoteBlur();
    }
  };
  const handleSetNullChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setNullState(newValue);
    updateNullDataForObject(dataOfSensor?.object?.id , newValue);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 400 }} aria-label="main sensor data table">
        <TableHead>
          <TableRow>
            <TableCell>Адрес установки</TableCell>
            <TableCell>Тип датчика</TableCell>
            <TableCell>Модель</TableCell>
            <TableCell style={{ width: '10%', textAlign: 'center' }}>Сетевой номер</TableCell>
            <TableCell style={{ width: '10%', textAlign: 'center' }}>Активность</TableCell>
            <TableCell style={{width: '10%', textAlign: 'center'}}>Установка<br/>нуля <sup>&#8432;&nbsp;&nbsp;&#8432;</sup></TableCell>
            <TableCell style={{textAlign: 'center' }}>Сообщения о ошибках</TableCell>
            <TableCell>Примечание</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography variant="body1">
                {dataOfSensor.object?.address} | {dataOfSensor.object?.name}
              </Typography>
            </TableCell>
            <TableCell>{dataOfSensor.sensor_type}</TableCell>
            <TableCell>{dataOfSensor.model}</TableCell>
            <TableCell style={{ width: '10%', textAlign: 'center' }}>
              {dataOfSensor.network_number}
            </TableCell>
            <TableCell style={{ width: '10%', textAlign: 'center' }}>
              {dataOfSensor.run ? <SvgSpinnersBarsScale /> : <LineMdPlayFilledToPauseTransition />}
            </TableCell>
            <TableCell style={{ cursor: 'pointer' }} align="center">
              {nullState ? <ThumbsUp size={24} color='#086837' /> : <ThumbsDown color='#9f093e' size={24} />}
            </TableCell>
            <TableCell style={{ textAlign: 'center', cursor: 'pointer' }} onClick={openModalErrorInfoSensor}>
              <Article size={24} />
            </TableCell>
            <TableCell
              style={{ cursor: 'pointer' }}
              align="center"
              onClick={handleNoteChangeClick}
            >
              {editableNote !== null ? (
                <TextField
                  value={editableNote}
                  onChange={handleNoteChange}
                  onBlur={handleNoteBlur}
                  onKeyPress={handleNoteKeyPress}
                  autoFocus
                  aria-label="notation"
                />
              ) : (
                dataOfSensor?.notation
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MainSensorDataTable;

import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  Typography
} from '@mui/material';
import { type SensorInfo } from "@/types/sensor";

interface OperationInfoAndLogForSensorProps {
  dataOfSensor: SensorInfo;
  updateOperationInfoAndLogForSensors: () => void;
}

const OperationInfoAndLogForSensor: React.FC<OperationInfoAndLogForSensorProps> = ({
                                                                                     dataOfSensor,
                                                                                     updateOperationInfoAndLogForSensors,
                                                                                   }) => {

  const { sensor_operation_log } = dataOfSensor;

  // Check if all the relevant fields are empty or undefined
  const isDataEmpty = !sensor_operation_log[0]?.passport_information &&
    !sensor_operation_log[0]?.verification_information &&
    !sensor_operation_log[0]?.warranty_information &&
    !sensor_operation_log[0]?.sensorOperationLogNotation;

  return (
    <Box>
      {isDataEmpty ? (
        <Typography variant="h6" align="left" sx={{ marginY: 2 }}>
          информация по журналам не загружена
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 400 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Информация о паспорте</TableCell>
                <TableCell>Информация о поверке</TableCell>
                <TableCell>Информация о гарантии</TableCell>
                <TableCell>Примечание</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{sensor_operation_log[0]?.passport_information}</TableCell>
                <TableCell>{sensor_operation_log[0]?.verification_information}</TableCell>
                <TableCell>{sensor_operation_log[0]?.warranty_information}</TableCell>
                <TableCell>{sensor_operation_log[0]?.sensorOperationLogNotation}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box display="flex" justifyContent="center" sx={{ marginY: 2 }}>
        <Button variant="contained" sx={{ minWidth: 200 }} onClick={updateOperationInfoAndLogForSensors}>
          Загрузить данные
        </Button>
      </Box>
    </Box>
  );
};

export default OperationInfoAndLogForSensor;

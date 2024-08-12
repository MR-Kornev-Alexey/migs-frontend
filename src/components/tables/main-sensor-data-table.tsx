import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {Article} from '@phosphor-icons/react';
import {SvgSpinnersBarsScale} from '@/components/animated-icon/chart-icon';
import {LineMdPlayFilledToPauseTransition} from '@/components/animated-icon/pause-icon';
import {SensorInfo} from "@/types/sensor";

interface MainSensorDataTableProps {
  dataOfSensor: SensorInfo;
  openModalErrorInfoSensor: () => void;
}

const MainSensorDataTable: React.FC<MainSensorDataTableProps> = ({dataOfSensor, openModalErrorInfoSensor}) => (
  <TableContainer component={Paper}>
    <Table sx={{minWidth: 400}} aria-label="main sensor data table">
      <TableHead>
        <TableRow>
          <TableCell>Адрес установки</TableCell>
          <TableCell>Тип датчика</TableCell>
          <TableCell>Модель</TableCell>
          <TableCell style={{width: '10%', textAlign: 'center'}}>Сетевой номер</TableCell>
          <TableCell style={{width: '10%', textAlign: 'center'}}>Активность</TableCell>
          <TableCell style={{textAlign: 'center'}}>Сообщения о ошибках</TableCell>
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
          <TableCell style={{width: '10%', textAlign: 'center'}}>
            {dataOfSensor.network_number}
          </TableCell>
          <TableCell style={{width: '10%', textAlign: 'center'}}>
            {dataOfSensor.run ? <SvgSpinnersBarsScale/> : <LineMdPlayFilledToPauseTransition/>}
          </TableCell>
          <TableCell style={{textAlign: 'center', cursor: 'pointer'}} onClick={openModalErrorInfoSensor}>
            <Article size={24}/>
          </TableCell>
          <TableCell>{dataOfSensor.notation}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);

export default MainSensorDataTable;

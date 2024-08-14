import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import convertUnits from '@/components/dashboard/additional-data-sensor/convert-units';
import {type AdditionalSensorInfo} from "@/types/sensor";

interface AdditionalSensorInfoTableProps {
  additionalInfo: AdditionalSensorInfo;
}

const AdditionalSensorInfoTable: React.FC<AdditionalSensorInfoTableProps> = ({ additionalInfo }) => (
  <TableContainer component={Paper}>
    <Table sx={{ minWidth: 400 }} aria-label="additional sensor info table">
      <TableHead>
        <TableRow>
          <TableCell style={{ textAlign: 'center' }}>Заводской номер</TableCell>
          <TableCell style={{ textAlign: 'center' }}>Единица измерения</TableCell>
          <TableCell style={{ textAlign: 'center' }}>Место установки</TableCell>
          <TableCell style={{ textAlign: 'center' }}>Коэффициент</TableCell>
          <TableCell style={{ textAlign: 'center' }}>Количество сбоя ответа подряд &#8432;</TableCell>
          <TableCell style={{ textAlign: 'center' }}>Порог выброса &#8432;</TableCell>
          <TableCell style={{ textAlign: 'center' }}>Количество выбросов подряд &#8432;</TableCell>
          <TableCell style={{ textAlign: 'center' }}>Количество ошибок подряд &#8432;</TableCell>
          <TableCell style={{ textAlign: 'center' }}>Количество min подряд &#8432;</TableCell>
          <TableCell style={{ textAlign: 'center' }}>Количество max подряд &#8432;</TableCell>
          <TableCell style={{ textAlign: 'center' }}>Примечание</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell style={{ textAlign: 'center' }}>{additionalInfo.factory_number}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{convertUnits(additionalInfo.unit_of_measurement)}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{additionalInfo.installation_location}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{additionalInfo.coefficient}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{additionalInfo.missedConsecutive}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{additionalInfo.limitValue}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{additionalInfo.emissionsQuantity}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{additionalInfo.errorsQuantity}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{additionalInfo.minQuantity}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{additionalInfo.maxQuantity}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{additionalInfo.additionalSensorInfoNotation}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);

export default AdditionalSensorInfoTable;

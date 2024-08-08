import React from 'react';
import { Modal } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { X } from '@phosphor-icons/react';

import setKindOfMaterial from '@/lib/common/kind-of-material';
import setKindOfObject from '@/lib/common/kind-of-object';

// Define the types
interface Organization {
  name: string;
}

interface Sensor {
  // Define fields for Sensor based on your application needs
}

interface DataObject {
  name: string;
  address: string;
  organization?: Organization;
  Sensor?: Sensor[]; // Array of sensors, or adjust the type as needed
  periodicity: number; // Assuming this is in milliseconds
  set_null?: boolean;
  objectsType: string; // or define an enum/type if you have specific types
  objectsMaterial: string; // or define an enum/type if you have specific materials
  geo?: string; // or define a specific type for geo if needed
  notation?: string;
}

interface ModalDataObjectProps {
  isOpen: boolean;
  onClose: () => void;
  dataObject?: any; // Made optional to handle the case where no data is provided
}

const ModalDataObject: React.FC<ModalDataObjectProps> = ({
                                                           isOpen,
                                                           onClose,
                                                           dataObject,
                                                         }) => {
  return (
    <Box>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            maxWidth: '95%',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 2,
            maxHeight: '620px', // Ограничение максимальной высоты модального окна
            overflowY: 'auto', // Вертикальный скролл
          }}
        >
          <Stack id="modal-modal-title" sx={{ marginBottom: 3, position: 'relative' }}>
            <Box display="flex" alignItems="center" justifyContent="center" width="100%" position="relative">
              <Typography variant="body1" sx={{ flexGrow: 1, textAlign: 'center' }}>
                Информация об объекте
              </Typography>
              <Box position="absolute" top={0} right={0}>
                <X size={32} onClick={onClose} style={{ cursor: 'pointer' }} />
              </Box>
            </Box>
          </Stack>
          {dataObject ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 400 }} aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>Название:</strong>
                    </TableCell>
                    <TableCell>{dataObject.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Адрес:</strong>
                    </TableCell>
                    <TableCell>{dataObject.address}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Организация:</strong>
                    </TableCell>
                    <TableCell>{dataObject.organization?.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Количество датчиков:</strong>
                    </TableCell>
                    <TableCell>{dataObject.Sensor?.length}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Периодичность опроса:</strong>
                    </TableCell>
                    <TableCell>{dataObject.periodicity} мс.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Установка нуля:</strong>
                    </TableCell>
                    <TableCell>{dataObject.set_null ? <span>да</span> : <span>нет</span>}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Тип объекта:</strong>
                    </TableCell>
                    <TableCell>{setKindOfObject(dataObject.objectsType)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Материал:</strong>
                    </TableCell>
                    <TableCell>{setKindOfMaterial(dataObject.objectsMaterial)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Геолокация:</strong>
                    </TableCell>
                    <TableCell>{dataObject.geo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Дополнительно:</strong>
                    </TableCell>
                    <TableCell>{dataObject.notation}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box>
              <Typography variant="body2">Данные не найдены</Typography>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ModalDataObject;

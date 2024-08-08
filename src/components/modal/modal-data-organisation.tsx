import React from 'react';
import { Modal } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { X } from '@phosphor-icons/react';

// Define the type for the organization data
interface DataOrganisation {
  name: string;
  inn: string;
  address: string;
  directorName: string;
  organizationPhone: string;
  organizationEmail: string;
}

// Define the props for the ModalDataOrganisation component
interface ModalDataOrganisationProps {
  isOpen: boolean;
  onClose: () => void;
  dataOrganisation?: DataOrganisation; // Made optional to handle the case where no data is provided
}

const ModalDataOrganisation: React.FC<ModalDataOrganisationProps> = ({
                                                                       isOpen,
                                                                       onClose,
                                                                       dataOrganisation,
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
            maxHeight: '600px', // Ограничение максимальной высоты модального окна
            overflowY: 'auto', // Вертикальный скролл
          }}
        >
          <Stack id="modal-modal-title" sx={{ marginBottom: 3, position: 'relative' }}>
            <Box display="flex" alignItems="center" justifyContent="center" width="100%" position="relative">
              <Typography variant="body1" sx={{ flexGrow: 1, textAlign: 'center' }}>
                Информация об организации
              </Typography>
              <Box position="absolute" top={0} right={0}>
                <X size={32} onClick={onClose} style={{ cursor: 'pointer' }} />
              </Box>
            </Box>
          </Stack>
          {dataOrganisation ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 400 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Название:</strong>
                    </TableCell>
                    <TableCell>{dataOrganisation.name}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>ИНН:</strong>
                    </TableCell>
                    <TableCell>{dataOrganisation.inn}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Адрес:</strong>
                    </TableCell>
                    <TableCell>{dataOrganisation.address}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Имя руководителя:</strong>
                    </TableCell>
                    <TableCell>{dataOrganisation.directorName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Телефон:</strong>
                    </TableCell>
                    <TableCell>{dataOrganisation.organizationPhone}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Email:</strong>
                    </TableCell>
                    <TableCell>{dataOrganisation.organizationEmail}</TableCell>
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

export default ModalDataOrganisation;

import React from 'react';
import {
  Modal,
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { X } from '@phosphor-icons/react';
import formatDateTime from '@/lib/common/format-date-time';
import {type ErrorData} from "@/types/sensor";

// Define the structure of the error data

// Define the props for the component
interface ModalInfoAboutSensorProps {
  isOpen: boolean;
  onClose: () => void;
  dataError?: ErrorData[]; // Optional array of ErrorData objects
}

// The component itself
const ModalInfoAboutSensor: React.FC<ModalInfoAboutSensorProps> = ({
                                                                     isOpen,
                                                                     onClose,
                                                                     dataError = [], // Default to an empty array if not provided
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
            width: 800,
            maxWidth: '95%',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 2,
            maxHeight: '360px', // Maximum height of the modal
            overflowY: 'auto', // Enable vertical scroll for the modal content
          }}
        >
          <Stack id="modal-modal-title" sx={{ marginBottom: 3, position: 'relative' }}>
            <Box display="flex" alignItems="center" justifyContent="center" width="100%" position="relative">
              <Typography variant="body1" sx={{ flexGrow: 1, textAlign: 'center' }}>
                Журнал ошибок
              </Typography>
              <Box position="absolute" top={0} right={0}>
                <X size={32} onClick={onClose} style={{ cursor: 'pointer' }} />
              </Box>
            </Box>
          </Stack>
          {dataError.length > 0 ? (
            <TableContainer component={Paper} sx={{ maxHeight: '260px', overflowY: 'auto' }}>
              <Table sx={{ minWidth: 400 }} aria-label="error log table">
                <TableHead>
                  <TableRow>
                    <TableCell>Дата</TableCell>
                    <TableCell>Ошибки</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataError.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDateTime(row.created_at)}</TableCell>
                      <TableCell>{row.error_information}</TableCell>
                    </TableRow>
                  ))}
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

export default ModalInfoAboutSensor;

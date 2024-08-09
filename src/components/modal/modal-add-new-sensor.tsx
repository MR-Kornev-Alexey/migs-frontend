import React from 'react';
import { Button, Modal, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { X } from '@phosphor-icons/react';
import { SignUpFormNewSensor } from '@/components/dashboard/sensors/sign-up-form-new-sensor';

// Define the type for the props
interface ModalNewSensorProps {
  isOpen: boolean;
  onClose: () => void;
  objects: any[]; // Replace `any` with the specific type if possible
  typesSensors: any[]; // Replace `any` with the specific type if possible
}

const ModalAddNewSensor: React.FC<ModalNewSensorProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         objects,
                                                         typesSensors,
                                                       }) => {
  return (
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
          p: 4,
        }}
      >
        <Stack id="modal-modal-title" sx={{ marginBottom: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="flex-end">
            <X size={32} onClick={onClose} style={{ cursor: 'pointer' }} />
          </Box>
        </Stack>
        <SignUpFormNewSensor
          closeModal={onClose}
          objects={objects}
          typesSensors={typesSensors}
        />
      </Box>
    </Modal>
  );
};

export default ModalAddNewSensor;

import React from 'react';
import { Modal } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { X } from '@phosphor-icons/react';
import { SignUpFormNewTypeSensor } from '@/components/dashboard/type-of-sensors/sign-up-form-new-type-sensor';
import {type ApiResult} from "@/types/result-api";

// Define the types for the props
interface ModalNewModelSensorProps {
  isOpen: boolean;
  onClose: () => void;
  isSensorKey: { sensorKey: string; sensorType: string };
  isResultSuccess: (result: ApiResult) => Promise<void>;
  isDisabled: boolean;
}

const ModalNewModelSensor: React.FC<ModalNewModelSensorProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   isSensorKey,
                                                                   isResultSuccess,
                                                                   isDisabled,
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
            p: 4,
          }}
        >
          <Stack id="modal-modal-title" sx={{ marginBottom: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              <X size={32} onClick={onClose} style={{ cursor: 'pointer' }} />
            </Box>
          </Stack>
          <SignUpFormNewTypeSensor
            closeModal={onClose}
            isSensorKey={isSensorKey}
            isResultSuccess={isResultSuccess}
            isDisabled={isDisabled}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default ModalNewModelSensor;

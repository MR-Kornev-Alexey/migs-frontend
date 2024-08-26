import React from 'react';
import {type AlertColor, Modal} from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { X } from '@phosphor-icons/react';
import {SignUpFormAddLog} from "@/components/dashboard/additional-data-sensor/sign-up-form-for-log";
import {type SensorInfo} from "@/types/sensor";

interface ModalNewOperationLogSensorProps {
  isOpen: boolean;
  onClose: () => void;
  dataOfSensor?:SensorInfo;
  isAlertModalColor?: AlertColor;
  isMessageAlertModal?: string;
  updateLogsInfoForSensor?: any;
}

const ModalNewOperationLogSensor: React.FC<ModalNewOperationLogSensorProps> = ({
                                                                                 isOpen,
                                                                                 onClose,
                                                                                 dataOfSensor,
                                                                                 isMessageAlertModal,
                                                                                 isAlertModalColor,
                                                                                 updateLogsInfoForSensor,
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
          <SignUpFormAddLog
            alertModalColor={isAlertModalColor!}
            modalMessage={isMessageAlertModal!}
            dataOfSensor={dataOfSensor!}
            updateLogsInfoForSensor={updateLogsInfoForSensor}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default ModalNewOperationLogSensor;

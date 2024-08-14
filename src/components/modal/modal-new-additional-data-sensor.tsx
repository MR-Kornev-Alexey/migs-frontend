import React from 'react';
import {type AlertColor, Modal} from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {X} from '@phosphor-icons/react';
import {SignUpFormAddDataSensor} from "@/components/dashboard/additional-data-sensor/sign-up-form-add-data-sensor";
import {type SensorInfo} from "@/types/sensor";


interface ModalNewAdditionalDataSensorProps {
  isOpen: boolean;
  onClose: () => void;
  sensorMain?: SensorInfo;
  successOfResult?: any;
  isMessageAlertModal: string;
  isAlertModalColor: AlertColor;
}

const ModalNewAdditionalDataSensor: React.FC<ModalNewAdditionalDataSensorProps> = ({
                                                                                     isOpen,
                                                                                     onClose,
                                                                                     sensorMain,
                                                                                     successOfResult,
                                                                                     isMessageAlertModal,
                                                                                     isAlertModalColor
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
          <Stack id="modal-modal-title" sx={{marginBottom: 3}}>
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              <X size={32} onClick={onClose} style={{cursor: 'pointer'}}/>
            </Box>
          </Stack>
          <SignUpFormAddDataSensor
            sensorMain={sensorMain!}
            successOfResult={successOfResult}
            isMessageAlertModal={isMessageAlertModal}
            isAlertModalColor={isAlertModalColor}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default ModalNewAdditionalDataSensor;

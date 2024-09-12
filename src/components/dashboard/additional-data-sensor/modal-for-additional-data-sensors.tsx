import React from 'react';
import { Modal, Box, Stack } from '@mui/material';
import { X } from '@phosphor-icons/react';
import PageForModal from "@/components/dashboard/additional-data-sensor/page-for-modal";

interface ModalAboutOneCustomerProps {
  isOpenModalAddData: boolean;
  onClose: () => void;
  mainUser: string;
}

const ModalForAdditionalDataSensors: React.FC<ModalAboutOneCustomerProps> = ({ mainUser,isOpenModalAddData, onClose }) => {
  return (
    <Modal
      open={isOpenModalAddData}
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
          width: '80%',
          maxWidth: '80%',
          maxHeight: '80vh',  // Set a maximum height for the modal
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          overflowY: 'auto', // Enable vertical scrolling
        }}
      >
        <Stack id="modal-modal-title" sx={{ marginBottom: 1 }}>
            <X size={32} onClick={onClose} style={{ cursor: 'pointer', position:"absolute", right: 12, top:12 }} />
          <Box sx={{ overflowY: 'auto', maxHeight: 'calc(80vh - 64px)' }}>
            <PageForModal mainUser={mainUser} />
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ModalForAdditionalDataSensors;

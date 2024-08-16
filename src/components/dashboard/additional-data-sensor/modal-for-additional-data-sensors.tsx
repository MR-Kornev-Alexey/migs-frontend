import React from 'react';
import { Modal, Box, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import { X } from '@phosphor-icons/react';
import PageForModal from "@/components/dashboard/additional-data-sensor/page-for-modal";

interface ModalAboutOneCustomerProps {
  isOpenModalAddData: boolean;
  onClose: () => void;
}

const ModalForAdditionalDataSensors: React.FC<ModalAboutOneCustomerProps> = ({ isOpenModalAddData, onClose }) => {
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
            <X size={32} onClick={onClose} style={{ cursor: 'pointer', position:"absolute", right: 40, top:28 }} />
          <Box sx={{ overflowY: 'auto', maxHeight: 'calc(80vh - 64px)' }}>
            {/* Adjust the maxHeight to account for padding and header */}
            <PageForModal />
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ModalForAdditionalDataSensors;

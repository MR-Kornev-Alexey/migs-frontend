import React from 'react';
import {AlertColor, Modal} from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { X } from '@phosphor-icons/react';
import { SignUpFormOrganization } from "@/components/dashboard/organizations/sign-up-form-organization";
import type {ApiResult} from "@/types/result-api";

// Define the props interface for the ModalNewOrganization component
interface ModalNewOrganizationProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistrationSuccess: (result: ApiResult) => void;
  setIsMessage: (message: string) => void;
  setAlertColor: (color: AlertColor) => void;
}

const ModalNewOrganization: React.FC<ModalNewOrganizationProps> = ({
                                                                     setAlertColor,
                                                                     setIsMessage,
                                                                     isOpen,
                                                                     onClose,
                                                                     onRegistrationSuccess
                                                                   }) => {
  const isMain: boolean = false;
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
          <SignUpFormOrganization
            onRegistrationSuccess={onRegistrationSuccess}
            isMain={isMain}
            setAlertColor={setAlertColor}
            setIsMessage={setIsMessage}/>
        </Box>
      </Modal>
    </Box>
  );
};

export default ModalNewOrganization;

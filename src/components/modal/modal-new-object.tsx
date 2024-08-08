import React from 'react';
import { Button, Modal, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { X } from '@phosphor-icons/react';
import { SignUpFormObject } from '@/components/dashboard/objects/sign-up-form-object';

// Define the props interface for the ModalNewObject component
interface ModalNewObjectProps {
  isOpenObject: boolean;
  onCloseObject: () => void;
  rowsOrganizations: any; // Replace 'any' with a more specific type if possible
  onRegistrationObjectSuccess: (data: any) => Promise<void>;
}

const ModalNewObject: React.FC<ModalNewObjectProps> = ({
                                                         isOpenObject,
                                                         onCloseObject,
                                                         rowsOrganizations,
                                                         onRegistrationObjectSuccess,
                                                       }) => {
  return (
    <Box>
      <Modal
        open={isOpenObject}
        onClose={onCloseObject}
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
              <X size={32} onClick={onCloseObject} style={{ cursor: 'pointer' }} />
            </Box>
          </Stack>
          <SignUpFormObject
            closeModal={onCloseObject}
            onRegistrationObjectSuccess={onRegistrationObjectSuccess}
            rowsOrganizations={rowsOrganizations}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default ModalNewObject;

import React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import {X} from '@phosphor-icons/react';

interface DialogAlertInfoProps {
  isOpen: boolean;
  onClose: () => void;
  isMessageAlert: string;
}

const DialogAlertInfo: React.FC<DialogAlertInfoProps> = ({
                                                                  isOpen,
                                                                  onClose,
                                                                  isMessageAlert
                                                                }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
    >
      <Box display="flex" alignItems="center" justifyContent="flex-end" sx={{padding: 1}}>
        <X size={28} onClick={onClose} style={{cursor: 'pointer'}}/>
      </Box>
      <DialogContent>
        {isMessageAlert}
      </DialogContent>
    </Dialog>
  );
};

export default DialogAlertInfo;

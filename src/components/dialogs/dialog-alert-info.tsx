import React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import {X} from '@phosphor-icons/react';
import Typography from "@mui/material/Typography";

interface DialogAlertInfoProps {
  isOpen: boolean;
  onClose: () => void;
  isMessageAlert: string;
  alertColor: string;
}

const DialogAlertInfo: React.FC<DialogAlertInfoProps> = ({
                                                                  isOpen,
                                                                  onClose,
                                                                  isMessageAlert,
                                                                  alertColor
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
        <Typography variant="body1"  color={alertColor}>
          {isMessageAlert}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAlertInfo;

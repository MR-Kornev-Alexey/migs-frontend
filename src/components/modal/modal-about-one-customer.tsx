import React, { useState } from 'react';
import { Modal, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { X } from '@phosphor-icons/react';
import {type CustomerType} from "@/types/customer";


interface ModalAboutOneCustomerProps {
  isModalInfoOpen: boolean;
  onClose: () => void;
  oneCustomer: CustomerType// Adjust the type as needed
}

interface DialogContentItemProps {
  label: string;
  value: string | undefined;
}
const ModalAboutOneCustomer: React.FC <ModalAboutOneCustomerProps> = ({ isModalInfoOpen, onClose, oneCustomer }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };
  function UserInfoUnavailable() {
  return <Box sx={{ marginTop: 1 }}>
      <Typography variant="body1">Дополнительная информация недоступна</Typography>
    </Box>
}

  const DialogContentItem: React.FC<DialogContentItemProps> = ({ label, value }) => (
    <Box sx={{ marginTop: 1 }}>
      <Typography variant="body1">
        {label} {value}
      </Typography>
    </Box>
  );

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '8px auto',
      textAlign: 'center',
    },
    textContainer: {
      maxHeight: expanded ? '600px' : '0',

      overflow: 'hidden',
      transition: 'max-height 0.5s ease-out',
      textAlign: 'left',
    },
  };

  return (
    <Box>
      <Modal
        open={isModalInfoOpen}
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
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              Пользователь: {oneCustomer?.name || ''}
            </Typography>
            {oneCustomer?.additionalUserInfo?.length ? (
              <>
                <DialogContentItem
                  label="ФИО:"
                  value={`${oneCustomer?.additionalUserInfo[0]?.firstName} ${oneCustomer?.additionalUserInfo[0]?.surName}`}
                />
                <DialogContentItem label="Телеграмм:" value={oneCustomer?.additionalUserInfo[0]?.telegram} />
                <DialogContentItem label="Телефон:" value={oneCustomer?.additionalUserInfo[0]?.phone} />
                <DialogContentItem label="Должность:" value={oneCustomer?.additionalUserInfo[0]?.position} />
              </>
            ) : (
              <UserInfoUnavailable />
            )}
            {oneCustomer?.organization ? (
              <Box sx={{ marginTop: 1 }} display="flex" justifyContent="center">
                <Button variant="contained" onClick={toggleExpanded} sx={{ marginTop: 2, width: '96%' }}>
                  {oneCustomer?.organization?.name}
                </Button>
              </Box>
            ) : (
              <UserInfoUnavailable />
            )}
            <Box sx={styles.container}>
              {expanded ? <Box sx={styles.textContainer}>
                  <>
                    <DialogContentItem label="Адрес" value={oneCustomer?.organization?.address} />
                    <DialogContentItem label="Email" value={oneCustomer?.organization?.organizationEmail} />
                    <DialogContentItem label="Телефон" value={oneCustomer?.organization?.organizationPhone} />
                  </>
                </Box> : null}
            </Box>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default ModalAboutOneCustomer;

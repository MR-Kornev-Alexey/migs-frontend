import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { styled } from '@mui/material/styles';

// Определяем типы пропсов
interface DialogAlertInfoProps {
  isOpen: boolean;
  onClose: () => void;
  isMessageAlert: string;
}

// Создаем переход слайд
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Стилизация диалога и текста
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#fde8e8', // Розовый фон
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  color: '#810707' // Красный цвет текста
}));

const StyledDialogContentText = styled(DialogContentText)(({ theme }) => ({
  color: '#810707' // Красный цвет текста
}));

const DialogTransitionAlert: React.FC<DialogAlertInfoProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 isMessageAlert
                                                               }) => {
  return (
    <StyledDialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <StyledDialogTitle>{"Внимание"}</StyledDialogTitle>
      <DialogContent>
        <StyledDialogContentText id="alert-dialog-slide-description">
          {isMessageAlert}
        </StyledDialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </StyledDialog>
  );
}

export default DialogTransitionAlert;

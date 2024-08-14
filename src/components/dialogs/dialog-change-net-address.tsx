import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSensors } from '@/store/sensors-reducer';
import { type AppDispatch, type RootState } from '@/store/store';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { X } from '@phosphor-icons/react';
import { sensorsClient } from '@/components/dashboard/sensors/sensors-client';

// Define the shape of a Sensor
interface Sensor {
  id: string;
  model: string;
  // Add other sensor properties as needed
}

// Define types for the props
interface DialogChangeNetAddressProps {
  isOpen: boolean;
  handleClose: () => void;
  isNetAddress: string;
  isFlagDouble: boolean;
  setIsNetAddress: React.Dispatch<React.SetStateAction<string>>;
  isIDSensor: string;
  sendUpdatedSensor: (sensor: Sensor) => void;
}

const DialogChangeNetAddress: React.FC<DialogChangeNetAddressProps> = ({
                                                                         isOpen,
                                                                         handleClose,
                                                                         isNetAddress,
                                                                         isFlagDouble,
                                                                         setIsNetAddress,
                                                                         isIDSensor,
                                                                         sendUpdatedSensor,
                                                                       }) => {
  const dispatch = useDispatch<AppDispatch>();
  const allSensors = useSelector((state: RootState) => state.allSensors.value);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsNetAddress(event.target.value);
  };

  // Find sensor model based on sensor ID
  const findModel = (): string => {
    const foundModel = allSensors.find((sensor) => sensor.id === isIDSensor);
    return foundModel ? foundModel.model : '';
  };

  // Handle form submission
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const newNetAddress = formJson.isNetAddress as string;
    const model = findModel();

    let sensorsData;
    if (!isFlagDouble) {
      sensorsData = await sensorsClient.changeNetAddressSensor(newNetAddress, isIDSensor);
      if (sensorsData?.oneSensor) {
        await sendUpdatedSensor(sensorsData.allSensors);
      }
    } else {
      sensorsData = await sensorsClient.sensorDuplication(newNetAddress, isIDSensor, model);
      if (sensorsData?.allSensors) {
        dispatch(addSensors(sensorsData.allSensors));
      }
    }
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleFormSubmit,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="flex-end" sx={{ padding: 1 }}>
        <X size={28} onClick={handleClose} style={{ cursor: 'pointer' }} />
      </Box>
      <DialogTitle>
        {!isFlagDouble ? 'Введите новый сетевой адрес' : 'Введите сетевой адрес нового датчика'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          id="isNetAddress"
          name="isNetAddress"
          label="Сетевой номер"
          defaultValue={isNetAddress}
          fullWidth
          variant="standard"
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button type="submit">{!isFlagDouble ? 'Изменить' : 'Дублировать'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogChangeNetAddress;

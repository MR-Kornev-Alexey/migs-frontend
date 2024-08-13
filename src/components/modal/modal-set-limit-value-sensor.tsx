import React, { useEffect } from 'react';
import {Alert, AlertColor, Modal} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { X } from '@phosphor-icons/react';
import { SensorInfo } from "@/types/sensor";
import NumberInputIntroduction from "@/components/dashboard/additional-data-sensor/number-input-introduction";

interface ModalSetLimitValueSensorProps {
  isOpen: boolean;
  onClose: () => void;
  sensorMain?: SensorInfo;
  isMessageAlertModal: string;
  isAlertModalColor: AlertColor;
  sendChangeDataForModelOnObject: (sentData: {
    limitValue: number;
    missedConsecutive: number;
    minQuantity: number;
    errorsQuantity: number;
    maxQuantity: number;
    emissionsQuantity: number;
    model: string;
    object_id: string; // Исправил тип на number
  }) => void;
}

const ModalSetLimitValueSensor: React.FC<ModalSetLimitValueSensorProps> = ({
                                                                             isOpen,
                                                                             onClose,
                                                                             sensorMain,
                                                                             sendChangeDataForModelOnObject,
                                                                             isMessageAlertModal,
                                                                             isAlertModalColor
                                                                           }) => {
  // Использование useEffect для обновления состояния при изменении sensorMain
  useEffect(() => {
    const additionalInfo = sensorMain?.additional_sensor_info?.[0];
    if (additionalInfo) {
      setLimitValue(additionalInfo.limitValue ?? 0); // Use default values if needed
      setEmissionsQuantity(additionalInfo.emissionsQuantity ?? 0);
      setErrorsQuantity(additionalInfo.errorsQuantity ?? 0);
      setMissedConsecutive(additionalInfo.missedConsecutive ?? 0);
      setMaxQuantity(additionalInfo.maxQuantity ?? 0);
      setMinQuantity(additionalInfo.minQuantity ?? 0);
    }
  }, [sensorMain]);

  const [limitValue, setLimitValue] = React.useState<number>(0);
  const [emissionsQuantity, setEmissionsQuantity] = React.useState<number>(0);
  const [errorsQuantity, setErrorsQuantity] = React.useState<number>(0);
  const [missedConsecutive, setMissedConsecutive] = React.useState<number>(0);
  const [maxQuantity, setMaxQuantity] = React.useState<number>(0);
  const [minQuantity, setMinQuantity] = React.useState<number>(0);

  const sendAllDataForSensors = () => {
    if (sensorMain) {
      const sentData = {
        object_id: sensorMain.object_id,
        model: sensorMain.model,
        limitValue,
        emissionsQuantity,
        errorsQuantity,
        missedConsecutive,
        maxQuantity,
        minQuantity,
      };
      sendChangeDataForModelOnObject(sentData);
    }
  };

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
            p: 2,
            maxHeight: '420px',
            overflowY: 'auto',
          }}
        >
          <Stack id="modal-modal-title" sx={{ marginBottom: 3, position: 'relative' }}>
            <Box display="flex" alignItems="center" justifyContent="center" width="100%" position="relative">
              <Box position="absolute" top={0} right={0}>
                <X size={32} onClick={onClose} style={{ cursor: 'pointer' }} />
              </Box>
            </Box>
            <Box sx={{ marginTop: 3 }}>
              <Typography variant="body1" sx={{ flexGrow: 1, textAlign: 'center' }}>
                Установка данных для датчиков{' '}<br />
                <strong>
                  {sensorMain?.sensor_type} {sensorMain?.model}
                </strong>{' '}<br />
                на объекте{' '}
                <strong>
                  {sensorMain?.object.name} {sensorMain?.object.address}
                </strong><sup>*</sup>
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ marginY: 1 }} variant="body2">
                Выберите порог выброса (+/-)
              </Typography>
              <NumberInputIntroduction value={limitValue} onChange={setLimitValue} />
              <Typography sx={{ marginY: 1 }} variant="body2">
                Выберите количество пропусков ответа подряд
              </Typography>
              <NumberInputIntroduction value={missedConsecutive} onChange={setMissedConsecutive} />
              <Typography sx={{ marginY: 1 }} variant="body2">
                Выберите количество выбросов подряд
              </Typography>
              <NumberInputIntroduction value={emissionsQuantity} onChange={setEmissionsQuantity} />
              <Typography sx={{ marginY: 1 }} variant="body2">
                Выберите количество ошибок подряд
              </Typography>
              <NumberInputIntroduction value={errorsQuantity} onChange={setErrorsQuantity} />
              <Typography sx={{ marginY: 1 }} variant="body2">
                Выберите количество max подряд
              </Typography>
              <NumberInputIntroduction value={maxQuantity} onChange={setMaxQuantity} />
              <Typography sx={{ marginY: 1 }} variant="body2">
                Выберите количество min подряд
              </Typography>
              <NumberInputIntroduction value={minQuantity} onChange={setMinQuantity} />
            </Box>
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button onClick={onClose}>Отмена</Button>
              <Button onClick={sendAllDataForSensors} disabled={limitValue === 0}>
                Изменить
              </Button>
            </Box>
            <Typography sx={{ marginTop: 1 }} variant="body2"><sup>*</sup>
              Значения выставляются для всего объекта и для данного типа датчика
            </Typography>
            {isMessageAlertModal && <Alert sx={{marginY:2 }} color={isAlertModalColor}>{isMessageAlertModal}</Alert>}
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default ModalSetLimitValueSensor;

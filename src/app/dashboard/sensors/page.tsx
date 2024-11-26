'use client';

import * as React from 'react';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {addSensors, updateSensors} from '@/store/sensors-reducer';
import {type AppDispatch, type RootState} from '@/store/store';
import {Alert, type AlertColor} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {useDispatch, useSelector} from 'react-redux';
import ImportExportButtons from '@/lib/common/import-export-buttons';
import Spinner from "@/components/animated-icon/spinner";
import updateSensorsAfterAPI from '@/components/dashboard/sensors/update-sensors-after-api';
import {sensorsClient} from '@/components/dashboard/sensors/sensors-client';
import SensorsPaginationAndSelectTable from "@/components/tables/sensors-pagination-and-select-table";
import {type ApiResult} from "@/types/result-api";
import DialogChangeNetAddress from "@/components/dialogs/dialog-change-net-address";
import ModalAddNewSensor from "@/components/modal/modal-add-new-sensor";
import {addSelectedSensor} from "@/store/selected-sensor-reducer";
import ModalForAdditionalDataSensors
  from "@/components/dashboard/additional-data-sensor/modal-for-additional-data-sensors";

export default function Page(): React.JSX.Element {
  const allSensors = useSelector((state: RootState) => state.allSensors.value);
  const allObjects = useSelector((state: RootState) => state.allObjects.value);
  const allTypesSensors = useSelector((state: RootState) => state.allTypesOfSensors.value);
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [sensors, setSensors] = useState<any[]>([]); // Define appropriate type for sensors
  const [isSelectedSensors, setIsSelectedSensors] = useState<string[]>([]); // or any suitable type
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalImportOpen, setIsModalImportOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDialogOpenNetAddress, setIsDialogOpenNetAddress] = useState<boolean>(false);
  const [isNetAddress, setIsNetAddress] = useState<string>('');
  const [isIDSensor, setIsIDSensor] = useState<string>('');
  const [isMessage, setIsMessageNew] = useState<string>('');
  const [alertColor, setAlertColor] = useState<AlertColor>('error');
  const [isFlagDouble, setIsFlagDouble] = useState<boolean>(false);
  const [showChoice, setShowChoice] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [isOpenModalAddData, setIsOpenModalAddData] = useState<boolean>(false);
  const [mainUser, setMainUser] = useState<string | null>(null);

  const openModalAddSensor = () => {
    setIsModalOpen(true);
  };
  const closeModalAddSensor = () => {
    setIsModalOpen(false);
  };
  const closeDialogNetAddress = () => {
    setIsDialogOpenNetAddress(false);
  };

  const closeModalAddData = () => {
    setIsOpenModalAddData(false);
  };
  const onExportClick = () => {
    setIsDialogOpen(false);
  };
  const onImportClick = () => {
    setIsModalImportOpen(true);
  };

  async function deleteOneSensor(sensor_id: string) {
    const sensorsData: ApiResult = await sensorsClient.deleteOneSensorFromApi(sensor_id);
    dispatch(addSensors(sensorsData.allSensors));
  }

  async function updateSensorDesignation(sensor_id: string, value: string) {
    const sensorsData: ApiResult = await sensorsClient.changeDesignationOneSensorFromApi(sensor_id, value)
    console.log(sensorsData?.allSensors)
    dispatch(addSensors(sensorsData?.allSensors));
  }

  //
  async function openAddInfoAboutSensors(sensor_id: string) {
    dispatch(addSelectedSensor(sensor_id));
    setIsOpenModalAddData(true);
  }

  async function handleChangeStatus(sensor_id: string) {
    const sensorsData: ApiResult = await sensorsClient.changeStatusOneSensorFromApi(sensor_id);
    console.log(sensorsData?.allSensors)
    dispatch(addSensors(sensorsData?.allSensors));
  }

  async function sendIdForCopy(sensor_id: string) {
    setIsDialogOpenNetAddress(true);
    setIsIDSensor(sensor_id);
    setIsFlagDouble(true);
  }

  async function sendUpdatedSensor(updatedData: any) {
    const updatedSensors = updateSensorsAfterAPI(allSensors, updatedData);
    dispatch(updateSensors(updatedSensors));
  }

  async function handleChangeNetAddress(sensor_id: string, network_number: string,) {
    const sensorsData: ApiResult = await sensorsClient.changeNetAddressSensor(sensor_id, network_number);
    dispatch(addSensors(sensorsData?.allSensors));
  }

  async function handleChangeIpAddress(sensor_id: string, ip_address: string) {
    const sensorsData: ApiResult = await sensorsClient.changeIPForSensor(sensor_id, ip_address);
    console.log(sensorsData?.allSensors)
    dispatch(addSensors(sensorsData?.allSensors));
  }

  async function onRegistrationSensorSuccess(sensorsData: any) {
    dispatch(updateSensors(sensorsData));
  }

  useEffect(() => {
    const selected: string[] = [];
    if (allSensors.length > 0) {
      allSensors.forEach((sensor) => {
        // Check if organization_id already exists in the selected array
        if (!selected.includes(sensor.object.id)) {
          // If not, add it to the selected array
          selected.push(sensor.object.id);
          setIsSelectedSensors(selected);
        }
      });
      setSensors(allSensors);
    }
  }, [allSensors]);

  useEffect(() => {
    const userString = localStorage.getItem('custom-auth-token');
    if (userString) {
      try {
        setMainUser(userString);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  async function restoreAllSensors(sensorsData: any) {
    setShowChoice(false);
    const selected: string[] = [];
    sensorsData.forEach((sensor: any) => {
      if (!selected.includes(sensor.object.id)) {
        selected.push(sensor.object.id);
        setIsSelectedSensors(selected);
      }
    });
  }

  function selectObject(selected: string[]) {
    setShowChoice(true);
    if (selected.length > 0) {
      setPage(0);
      setIsSelectedSensors(selected);
    }
  }

  function onSelectedRowsSensors(sensors: any[], selected: string[]) {
    // console.log('sensors --', sensors);
    if (sensors.length > 0) {
      return sensors.filter((obj: any) => selected.includes(obj.object.id));
    }
    return sensors;

  }

  if (!mainUser) {
    return <div>Loading...</div>;
  }
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Датчики</Typography>
      </Box>
      {loading ? (
        <Spinner/>
      ) : (
        <Stack>
          <ImportExportButtons onExportClick={onExportClick} onImportClick={onImportClick}/>
          <SensorsPaginationAndSelectTable
            mainUser={mainUser}
            rows={onSelectedRowsSensors(sensors, isSelectedSensors)}
            selectObject={selectObject}
            page={page}
            setPage={setPage}
            handleChangeIpAddress={handleChangeIpAddress}
            deleteOneSensor={deleteOneSensor}
            sendIdForCopy={sendIdForCopy}
            handleChangeStatus={handleChangeStatus}
            handleChangeNetAddress={handleChangeNetAddress}
            updateSensorDesignation={updateSensorDesignation}
            openAddInfoAboutSensors={openAddInfoAboutSensors}
          />
          <Box display="flex" justifyContent="space-around" sx={{marginTop: 3}}>
            {showChoice ? <Button variant="contained" onClick={() => restoreAllSensors(sensors)} sx={{width:260}}>
              Сбросить выборку
            </Button> : null}
          </Box>
        </Stack>
      )}
      {mainUser && (JSON.parse(mainUser).role === "supervisor" || JSON.parse(mainUser).role === "admin") && (
        <Box display="flex" justifyContent="center" sx={{ marginTop: 2 }}>
          <Button variant="contained" onClick={openModalAddSensor} sx={{width:260}}>
            Добавить датчик на объект
          </Button>
        </Box>
      )}
      <DialogChangeNetAddress
        isOpen={isDialogOpenNetAddress}
        isIDSensor={isIDSensor}
        isFlagDouble={isFlagDouble}
        handleClose={closeDialogNetAddress}
        isNetAddress={isNetAddress}
        setIsNetAddress={setIsNetAddress}
        sendUpdatedSensor={sendUpdatedSensor}
      />
      <ModalAddNewSensor
        isOpen={isModalOpen}
        onClose={closeModalAddSensor}
        objects={allObjects}
        typesSensors={allTypesSensors}
      />
      <ModalForAdditionalDataSensors isOpenModalAddData={isOpenModalAddData} onClose={closeModalAddData}  mainUser={mainUser}/>
      {isMessage ? <Alert color={alertColor}>{isMessage}</Alert> : null}
    </Stack>
  );
}

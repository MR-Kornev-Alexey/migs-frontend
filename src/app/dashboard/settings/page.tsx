"use client"
import * as React from 'react';
import {useEffect, useState} from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ImportExportButtons from '@/lib/common/import-export-buttons';
import jsonData from '@/lib/json/sensors.json';
import {useDispatch, useSelector} from "react-redux";
import {type AppDispatch, type RootState} from "@/store/store";
import Box from "@mui/material/Box";
import OrganizationsPaginationActionsTable from "@/components/tables/organizations-pagination-actions-table";
import Button from "@mui/material/Button";
import ModalNewOrganization from "@/components/modal/modal-new-organization";
import Alert from "@mui/material/Alert";
import type {AlertColor} from "@mui/material";
import {addOrganizations} from "@/store/organization-reducer";
import ObjectsPaginationActionsTable from "@/components/tables/objects-pagination-actions-table";
import TypeSensorsWithoutSelect from "@/components/tables/type-sensors-without-select";
import {sensorsClient} from "@/components/dashboard/sensors/sensors-client";
import ModalNewObject from "@/components/modal/modal-new-object";
import {addObjects} from "@/store/object-reducer";
import Spinner from "@/components/animated-icon/spinner";
import {type ApiResult} from "@/types/result-api";
import {addTypeOfSensors} from "@/store/type-of-sensors-reducer";
import ModalNewModelSensor from "@/components/modal/modal-new-model-sensor";
import ModalDataOrganisation from "@/components/modal/modal-data-organisation";
import ModalDataObject from "@/components/modal/modal-data-object";
import {organizationClient} from "@/components/dashboard/organizations/organization-client";
import {objectClient} from "@/components/dashboard/objects/object-client";
import {type MObject} from "@/types/common-types";
import {addSensors} from "@/store/sensors-reducer";
import DialogAlertInfo from "@/components/dialogs/dialog-alert-info";

interface SensorKeyType {
  sensorKey: string;
  sensorType: string;
}

interface DataOrganisation {
  name: string;
  inn: string;
  address: string;
  directorName: string;
  organizationPhone: string;
  organizationEmail: string;
}

export default function Page(): React.JSX.Element {
  const objects = useSelector((state: RootState) => state.allObjects.value);
  const organizations = useSelector((state: RootState) => state.allOrganizations.value);
  const typesSensors = useSelector((state: RootState) => state.allTypesOfSensors.value);
  const [isSelectOrganisation, setIsSelectOrganisation] = useState<DataOrganisation>( { name: "string",
  inn: '',
  address: '',
  directorName: '',
  organizationPhone: '',
  organizationEmail:''}
);
  const [isSelectObject, setIsSelectObject] = useState<MObject | undefined>();
  const [isOpenDataOrganisation, setIsOpenDataOrganisation] = useState<boolean>(false);
  const [isOpenDataObject, setIsOpenDataObject] = useState<boolean>(false);
  const [isSelectedObjects, setIsSelectedObjects] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<AlertColor>('error');
  const [isModalObjectOpen, setIsModalObjectOpen] = useState<boolean>(false);
  const [showInit, setShowInit] = useState<boolean>(true);
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [isSensorKey, setIsNewKey] = useState<SensorKeyType>({sensorKey: '', sensorType: ''});
  const [isOpenNewTypeSensor, setIsOpenNewTypeSensor] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isDialogMessage, setIsDialogMessage] = React.useState<string>('Ошибка обработки данных');
  const isMain = false;
  const dispatch = useDispatch<AppDispatch>();
  const openModal = () => {
    setIsModalOpen(true);
  };
  const openModalObject = () => {
    setIsModalObjectOpen(true);
  };
  const closeDataObject = () => {
    setIsOpenDataObject(false);
  };
  const closeDialog = () => {
    setIsOpenDialog(false);
  };
  const closeDataOrganisation = () => {
    setIsOpenDataOrganisation(false);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModalNewModel = (sensorKey: SensorKeyType) => {
    setIsNewKey(sensorKey);
    setIsOpenNewTypeSensor(true);
    setIsDisabled(true);
  };
  const closeModalNewModel = () => {
    setIsOpenNewTypeSensor(false);
  };
  const isResultSuccess = async (result: ApiResult) => {
    dispatch(addTypeOfSensors(result.allSensorsType));
  };

  const openModalNewType = () => {
    setIsNewKey({sensorKey: '', sensorType: ''});
    setIsOpenNewTypeSensor(true);
    setIsDisabled(false);
  };
  const onExportClick = () => {
    // setIsModalObjectOpen(false);
  };
  const onImportClick = () => {
    // setIsModalObjectOpen(false);
  };
  async function onSelectedRowsChange(selected: Set<string>) {
    // Convert the Set to an array
    const selectedArray = Array.from(selected);
    // Set the array to state
    setIsSelectedObjects(selectedArray);
  }
  const openDataOrganisation = (iDOrganisation: any) => {
    setIsOpenDataOrganisation(true);
    console.log('iDOrganisation ---', iDOrganisation);
    const selectedOrganisation = organizations.find((org) => org.id === iDOrganisation);
    setIsSelectOrganisation(selectedOrganisation);
  };
  async function onRegistrationOrganizationSuccess(organizationsData: any) {
    dispatch(addOrganizations(organizationsData?.allOrganizations));
  }

  const onRegistrationObjectSuccess = async (data: any) => {
    dispatch(addObjects(data));
    setTimeout(() => {
      setIsModalObjectOpen(false);
      },1000
    )
  };

  function onSelectedRowsObjects(objects: any, selected: string[]) {
    return objects.filter((obj: any) => selected.includes(obj.organization_id));
  }

  const openDataSelectObject = (iDObject: string) => {
    setIsOpenDataObject(true);
    if (!objects) {
      console.error('allObjects is undefined');
      return; // или другая логика обработки ошибки
    }
    const selectedObject = objects.find((obj: any) => obj.id === iDObject);
    setIsSelectObject(selectedObject);
  };

  useEffect(() => {
    if (typesSensors.length !== 0) {
      setShowInit(false);
    }
  }, [typesSensors]);

  const deleteObject = async (idObject: string)=> {
    try {
      const result:any = await objectClient.deleteOneObject(idObject);
      if (result?.statusCode === 200) {
        dispatch(addObjects(result?.allObjects));
        dispatch(addSensors(result?.allSensors));
        setIsMessage(result?.message ?? ''); // Provide a default empty string
        setAlertColor('success');
      } else if (result?.statusCode === 400) {
        setIsMessage(result?.message ?? '');
        setAlertColor('error');
      } else {
        setIsMessage(result?.message ?? '');
        setAlertColor('error');
      }
    }
    catch (error) {
      setIsMessage(`Произошла ошибка:${  (error as Error).message}`);
      setAlertColor('error');
    } finally {
      setIsPending(false);
      setTimeout(() => {
        setIsMessage("");
      }, 2500);
    }
  }
  const deleteOneOrganisation = async (iDOrganisation: any) => {
    try {
    const result = await organizationClient.deleteOneOrganization(iDOrganisation);
    if (result?.statusCode === 200) {
      dispatch(addOrganizations(result?.allOrganizations));
      setIsMessage(result?.message ?? ''); // Provide a default empty string
      setAlertColor('success');
    } else if (result?.statusCode === 400) {
      setIsMessage(result?.message ?? '');
      setAlertColor('error');
    } else {
      setIsMessage(result?.message ?? '');
      setAlertColor('error');
    }
  } catch (error) {
    setIsMessage(`Произошла ошибка:${  (error as Error).message}`);
    setAlertColor('error');
  } finally {
    setIsPending(false);
    setTimeout(() => {
      setIsMessage("");
    }, 2500);
  }
  };

  const initAllTypeSensors = async () => {
    setIsPending(true);
    try {
      const result: ApiResult = await sensorsClient.initNewAllTypeOfSensors(jsonData);
      if (result?.statusCode === 200) {
        dispatch(addTypeOfSensors(result.allSensorsType));
        setIsMessage(result?.message ?? ''); // Provide a default empty string
        setAlertColor('success');
      } else if (result?.statusCode === 400) {
        setIsMessage(result?.message ?? '');
        setAlertColor('error');
        ;
      } else {
        setIsMessage(result?.message ?? '');
        setAlertColor('error');
      }
    } catch (error) {
      setIsMessage(`Произошла ошибка:${  (error as Error).message}`);
      setAlertColor('error');
    } finally {
      setIsPending(false);
      setTimeout(() => {
        setIsMessage("");
      }, 1000);
    }
  };

  const updateNullDataForObject = async (object_id: string, parameter: boolean) => {
    try {
      const result: ApiResult = await sensorsClient.setNullForAllSensorOnObject(object_id, parameter);
      if (result?.statusCode === 200) {
        dispatch(addObjects(result?.allObjects));
        dispatch(addSensors(result?.allSensors));
        setIsOpenDialog(true);
        setIsDialogMessage(result?.message ?? ''); // Provide a default empty string
        setAlertColor('success');
      } else  {
        setIsDialogMessage(result?.message ?? '');
        setIsOpenDialog(true);
        setAlertColor('error');
      }
    } catch (error) {
      setIsMessage(`Произошла ошибка:${  (error as Error).message}`);
      setIsOpenDialog(true);
      setAlertColor('error');
    }
    finally {
      setTimeout(() => {
        setIsDialogMessage('');
        setIsOpenDialog(false);
      }, 7000);
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Организации</Typography>
      </Box>
      {isMessage ? <Alert color={alertColor}>{isMessage}</Alert> : null}
      {organizations?.length > 0 ? (
        <Box>
          <ImportExportButtons onExportClick={onExportClick} onImportClick={onImportClick}/>
          <OrganizationsPaginationActionsTable
            rows={organizations}
            onSelectedRowsChange={onSelectedRowsChange}
            openDataOrganisation={openDataOrganisation}
            deleteOneOrganisation={deleteOneOrganisation}/>
          <Box display="flex" justifyContent="space-around" sx={{marginTop: 2}}>
            <Button variant="contained" onClick={openModal}>
              Добавить организацию
            </Button>
          </Box>
        </Box>
      ) : <Box>
        <Typography variant="body1">Данные по организациям не загружены. Проверьте интернет-соединение</Typography>
      </Box>}
      <Box>
        <Typography variant="h4">Объекты</Typography>
      </Box>
      {isSelectedObjects.length > 0 ? (
        <Stack spacing={2}>
          <ImportExportButtons onExportClick={onExportClick} onImportClick={onImportClick}/>
          <ObjectsPaginationActionsTable
            rows={onSelectedRowsObjects(objects, isSelectedObjects)}
            selectObject={openDataSelectObject}
            deleteObject={deleteObject}
            updateNullDataForObject={updateNullDataForObject}/>
        </Stack>
      ) : (
        <Stack>
          <Typography variant="body1">Выберите организацию для отображения объектов</Typography>
        </Stack>
      )}
      <Box display="flex" justifyContent="space-around">
        <Button variant="contained" onClick={openModalObject}>
          Добавить новый объект
        </Button>
      </Box>
      <Box>
        <Typography variant="h4">Типы датчиков</Typography>
      </Box>
      <ImportExportButtons onExportClick={onExportClick} onImportClick={onImportClick}/>
      <TypeSensorsWithoutSelect rows={typesSensors} openModalNewModel={openModalNewModel}/>
      <Box display="flex" justifyContent="space-around">
        <Button variant="contained" onClick={openModalNewType}>
          Добавить новый тип датчика
        </Button>
        {showInit ? <Button disabled={isPending} onClick={initAllTypeSensors} variant="contained">
            {isPending ? (
              <Spinner/>
            ) : (
              <Box>Первичная инсталляция</Box>
            )}
          </Button> : null}
      </Box>
      <ModalNewModelSensor
        isOpen={isOpenNewTypeSensor}
        onClose={closeModalNewModel}
        isSensorKey={isSensorKey}
        isResultSuccess={isResultSuccess}
        isDisabled={isDisabled}
      />
      <ModalNewOrganization
        isMain={isMain}
        isOpen={isModalOpen}
        onClose={closeModal}
        onRegistrationSuccess={onRegistrationOrganizationSuccess}
        setAlertColor={setAlertColor}
        setIsMessage={setIsMessage}/>

      <ModalDataObject
        isOpen={isOpenDataObject}
        onCloseOut={closeDataObject}
        dataObject={isSelectObject} />

      <ModalDataOrganisation
        isOpen={isOpenDataOrganisation}
        onClose={closeDataOrganisation}
        dataOrganisation={isSelectOrganisation}
      />
      <ModalNewObject
        isOpenObject={isModalObjectOpen}
        onCloseObject={closeDataObject}
        onRegistrationObjectSuccess={onRegistrationObjectSuccess}
        rowsOrganizations={organizations}
      />
      <DialogAlertInfo isOpen={isOpenDialog} onClose={closeDialog} isMessageAlert={isDialogMessage} alertColor={alertColor}/>
    </Stack>
  );
}

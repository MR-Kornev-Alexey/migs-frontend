// src/components/ObjectsSelection.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { addSelectedObjects } from '@/store/selected-objects-reducer';
import { type MObject, type NewSensor } from '@/types/common-types';
import AllObjectsPaginationSelectTable from "@/components/tables/all-objects-pagination-select-table";
import ModalDataObject from "@/components/modal/modal-data-object";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface ObjectsSelectionProps {
  title: string;
  subTitle: string;
  setIsOpenModalCreateData: (value: (((prevState: boolean) => boolean) | boolean)) => void;
}

export default function ObjectsSelection({title, subTitle, setIsOpenModalCreateData }: ObjectsSelectionProps): React.JSX.Element {
  const allObjects = useSelector((state: RootState) => state.allObjects.value);
  const [selectedObjects, setSelectedObjects] = useState<MObject[]>([]);
  const [isOpenDataObject, setIsOpenDataObject] = useState<boolean>(false);
  const [isSelectObject, setIsSelectObject] = useState<MObject | undefined>(undefined);
  const dispatch: AppDispatch = useDispatch();

  const closeDataObject = () => {
    setIsOpenDataObject(false);
  };


  async function selectOneObjectForTable(selectedId: string) {
    try {
      if (!selectedId) {
        return;
      }

      const selectedObject = allObjects.find((object) => object.id === selectedId);

      if (selectedObject) {
        const sortedSensorsList = sortedSensors(selectedObject.Sensor);

        const updatedObject = {
          ...selectedObject,
          Sensor: sortedSensorsList,
        };

        dispatch(addSelectedObjects([updatedObject]));
        setIsOpenModalCreateData(true);
      } else {
        console.warn("Object not found:", selectedId);
      }
    } catch (error) {
      console.error("Ошибка при обновлении выбранного объекта:", error);
    }
  }

  const selectOneObjectForInfo = (iDObject: string) => {
    setIsOpenDataObject(true);
    const selectedObject = allObjects.find((obj: MObject) => obj.id === iDObject);
    setIsSelectObject(selectedObject);
  };

  useEffect(() => {
    const filteredObjects = allObjects.filter(
      (obj) => Array.isArray(obj.Sensor) && obj.Sensor.length > 0
    );
    setSelectedObjects(filteredObjects);
  }, [allObjects]);

  const sortedSensors = (sensors: NewSensor[]) => {
    return [...sensors].sort((a, b) => a.model.localeCompare(b.model));
  };

  return (
    <Stack spacing={3}>
    <Typography variant="h4">{title}</Typography>
      <Typography variant="body1">
    Для построения {subTitle.toLowerCase()} выберите объект
  </Typography>
  <AllObjectsPaginationSelectTable
  rows={selectedObjects}
  selectOneObjectForInfo={selectOneObjectForInfo}
  selectOneObjectForTable={selectOneObjectForTable}
  />
  <ModalDataObject
  isOpen={isOpenDataObject}
  onCloseOut={closeDataObject}
  dataObject={isSelectObject}
  />
  </Stack>
);
}

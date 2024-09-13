'use client';
import React, {useEffect, useState} from 'react';
import {
  Stack,
} from '@mui/material';
import ObjectsSelection from "@/lib/common/objects-selection";
import CreateTablesPage from "@/components/dashboard/tables/create-tables-page";

export default function Page(): React.JSX.Element {
  const [mainUser, setMainUser] = useState<string | null>(null);
  const [isShowSelectedSensors, setIsShowSelectedSensors] = useState<boolean>(false);
  let [isCounter, setIsCounter] = useState<number>(0);

  const showAndCreateSensors = (data:boolean):void => {
    setIsCounter(isCounter++);
    setIsShowSelectedSensors(data)

  }

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

  return (
    <Stack spacing={3}>
      <ObjectsSelection title="Таблицы" subTitle="таблиц" setIsOpenModalCreateData={showAndCreateSensors}/>
      {isShowSelectedSensors ? <CreateTablesPage  mainUser={mainUser!} isCounter={isCounter}/> : null}
    </Stack>
  );
}

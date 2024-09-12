'use client';
import React, {useEffect, useState} from 'react';
import {
  Stack,
} from '@mui/material';
import ModalForCreateTables from "@/components/dashboard/additional-data-sensor/modal-for-create-tables";
import ObjectsSelection from "@/lib/common/objects-selection";

export default function Page(): React.JSX.Element {
  const [mainUser, setMainUser] = useState<string | null>(null);
  const [isOpenModalCreateData, setIsOpenModalCreateData] = useState<boolean>(false);
  const closeIsOpenModalCreateData = () => {
    setIsOpenModalCreateData(false);
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
      <ObjectsSelection title="Таблицы" subTitle="таблиц" setIsOpenModalCreateData={setIsOpenModalCreateData}/>
      <ModalForCreateTables
        isOpenModalCreateData={isOpenModalCreateData}
        onClose={closeIsOpenModalCreateData} mainUser={mainUser!}/>
    </Stack>
  );
}

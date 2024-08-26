'use client';
import React, {useState, useEffect} from 'react';
import {
  Stack,
} from '@mui/material';
import ModalForCreateTables from "@/components/dashboard/additional-data-sensor/modal-for-create-tables";
import ObjectsSelection from "@/lib/common/objects-selection";
export default function Page(): React.JSX.Element {
  const [isOpenModalCreateData, setIsOpenModalCreateData] = useState<boolean>(false);
  const closeIsOpenModalCreateData = () => {
    setIsOpenModalCreateData(false);
  }

  return (
    <Stack spacing={3}>
      <ObjectsSelection title={"Таблицы"} subTitle={"таблиц"} setIsOpenModalCreateData={setIsOpenModalCreateData}/>
      <ModalForCreateTables
        isOpenModalCreateData={isOpenModalCreateData}
        onClose={closeIsOpenModalCreateData}/>
    </Stack>
  );
}

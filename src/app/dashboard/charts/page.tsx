'use client';
import React, {useState, useEffect} from 'react';
import {
  Stack,
} from '@mui/material';
import ModalForCreateCharts from "@/components/dashboard/additional-data-sensor/modal-for-create-charts";
import ObjectsSelection from "@/lib/common/objects-selection";
export default function Page(): React.JSX.Element {
  const [isOpenModalCreateData, setIsOpenModalCreateData] = useState<boolean>(false);
  const closeIsOpenModalCreateData = () => {
    setIsOpenModalCreateData(false);
  }

  return (
    <Stack spacing={3}>
      <ObjectsSelection title={"Графики"} subTitle={"графиков"} setIsOpenModalCreateData={setIsOpenModalCreateData}/>
      <ModalForCreateCharts
        isOpenModalCreateData={isOpenModalCreateData}
        onClose={closeIsOpenModalCreateData}/>
    </Stack>
  );
}

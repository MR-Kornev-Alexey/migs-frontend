"use client"
import * as React from 'react';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ImportExportButtons from '@/lib/common/import-export-buttons';
import jsonData from '@/lib/json/sensors.json';
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import Box from "@mui/material/Box";
import OrganizationsPaginationActionsTable from "@/components/tables/organizations-pagination-actions-table";
import Button from "@mui/material/Button";

export default function Page(): React.JSX.Element {
  const objects = useSelector((state: RootState) => state.allObjects.value);
  const organizations = useSelector((state: RootState) => state.allOrganizations.value);
  const typesSensors = useSelector((state: RootState) => state.allTypesOfSensors.value);
  const [isSelectOrganisation, setIsSelectOrganisation] = useState<any[]>([]);
  const [isSelectObject, setIsSelectObject] = useState<any[]>([]);
  const [isOpenDataOrganisation, setIsOpenDataOrganisation] = useState<boolean>(false);
  const [isSelectedObjects, setIsSelectedObjects] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const onExportClick = () => {
    // setIsModalObjectOpen(false);
  };
  const onImportClick = () => {
    // setIsModalObjectOpen(false);
  };
  async function onSelectedRowsChange(selected:any) {
    console.log('selected ---', selected);
    setIsSelectedObjects(selected);
  }

  const openDataOrganisation = (iDOrganisation: any) => {
    setIsOpenDataOrganisation(true);
    console.log('iDOrganisation ---', iDOrganisation);
    const selectedOrganisation = organizations.find((org) => org.id === iDOrganisation);
    setIsSelectOrganisation(selectedOrganisation);
  };

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Организации</Typography>
      </div>
      {organizations?.length > 0 ? (
        <Box>
          <ImportExportButtons onExportClick={onExportClick} onImportClick={onImportClick}/>
          <OrganizationsPaginationActionsTable
            rows={organizations}
            onSelectedRowsChange={onSelectedRowsChange}
            openDataOrganisation={openDataOrganisation}
          />
          <Box display="flex" justifyContent="space-around">
            <Button variant="contained" onClick={openModal}>
              Добавить организацию
            </Button>
          </Box>
        </Box>
      ): <Box>
        <Typography variant="body1">Данные по организациям не загружены. Проверьте интернет-соединение</Typography>
      </Box>}
    </Stack>
  );
}

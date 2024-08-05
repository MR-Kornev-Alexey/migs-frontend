'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ImportExportButtons from '@/lib/common/import-export-buttons';
import SpinnerWithAlert from '@/lib/common-api/spinner-with-alert';
import { customersClient } from '@/lib/customers/customers-client';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import ModalAboutOneCustomer from '@/components/modal/modal-about-one-customer';
import ModalNewCustomer from '@/components/modal/modal-new-customer';
import CustomTableWithoutSelect from '@/components/tables/custom-table-without-select';
import {CustomerType} from "@/types/customer";
import {AlertColor} from "@mui/material";

export default function Page(): React.JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalInfoOpen, setIsModalInfoOpen] = useState<boolean>(false);
  const [isSelectedCustomers, setIsSelectedCustomers] = useState([]);
  const [oneCustomer, setOneCustomer] = useState<CustomerType>({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "",
    registration_status: "",
    created_at: new Date(),
    additionalUserInfo: [],
    organization: undefined // or an appropriate default object if required
  });
  const [isMessage, setIsMessage] = React.useState<string>('');
  const [alertColor, setAlertColor] = React.useState<AlertColor>('error');
  const [page, setPage] = React.useState(0);
  const [showChoice, setShowChoice] = useState<boolean>(false);

  useEffect(() => {
    fetchCustomers()
      .then((data) => {
        let selected:any = [];
        if (data?.allUsers.length > 0) {
          setLoading(true);
          // Перебор каждого пользователя
          data?.allUsers.forEach((user:any) => {
            // Проверка, существует ли уже organization_id в массиве selected
            if (!selected.includes(user.organization_id)) {
              // Если нет, добавляем его в массив selected
              selected.push(user.organization_id);
            }
          });
          setIsSelectedCustomers(selected);
          setCustomers(data?.allUsers);
        } else {
          setIsMessage('Ошибка при загрузке данных о пользователях');
        }
      })
      .catch((error:any) => {
        setAlertColor('error');
        setIsMessage('Ошибка при загрузке данных:' + error);
        setLoading(false); // Установка loading в false в случае ошибки
      });
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const closeInfoModal = () => {
    setIsModalInfoOpen(false);
  };
  const onExportClick = () => {
    // setIsModalObjectOpen(false);
  };
  const onImportClick = () => {
    // setIsModalObjectOpen(false);
  };

  const deleteCustomer = async (id: string) => {
    const result: any = await customersClient.deleteCustomer(id);
    console.log(result)
    switch (result?.data?.statusCode) {
      case 200:
        setAlertColor('success');
        setIsMessage(result?.data?.message);
        setCustomers(result?.data?.allUsers);
        setTimeout(() => {
          setIsMessage("");
        }, 2000);
        break;
      case 400:
      case 500:
        setAlertColor('error');
        setIsMessage(result?.data?.message);
        break;
      default:
        setAlertColor('error');
        setIsMessage(result?.error?.message || 'Произошла ошибка');
        break;
    }
  };
  async function infoAboutCustomer(row:any) {
    await setOneCustomer(row);
    await setIsModalInfoOpen(true);
    console.log(row);
  }
  async function onRegistrationCustomerSuccess(allUsers:Customer[]) {
    console.log(allUsers)
    setCustomers(allUsers);
  }
  function onSelectedRowsChange(selected:any) {
    setShowChoice(true);
    if (selected.length > 0) {
      setPage(0);
      setIsSelectedCustomers(selected);
    }
  }
  function onSelectedRowsCustomers(objects: any, selected:any) {
    if (objects?.length > 0) {
      return objects.filter((obj:any) => selected.includes(obj.organization_id));
    } else {
      return [];
    }
  }

  function restoreAllOrganization() {
    setShowChoice(false);
    let selected: any = [];
    // Перебор каждого пользователя
    customers.forEach((user: any) => {
      // Проверка, существует ли уже organization_id в массиве selected
      if (!selected.includes(user?.organization_id)) {
        // Если нет, добавляем его в массив selected
        selected.push(user?.organization_id);
      }
      setIsSelectedCustomers(selected);
    });
  }
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Пользователи</Typography>
      </div>
      <ImportExportButtons onExportClick={onExportClick} onImportClick={onImportClick} />
      <CustomersFilters />
      {!loading ? (
        <SpinnerWithAlert isMessage={isMessage} alertColor={alertColor} />
      ) : (
        <Box>
          <CustomTableWithoutSelect
            rows={onSelectedRowsCustomers(customers, isSelectedCustomers)}
            openModal={openModal}
            selectOrganization={onSelectedRowsChange}
            restoreAllOrganization={restoreAllOrganization}
            page={page}
            setPage={setPage}
            deleteCustomer={deleteCustomer}
            infoAboutCustomer={infoAboutCustomer}
          />{' '}
          <Box display="flex" justifyContent="space-around" sx={{ marginTop: 3 }}>
            <Button variant="contained" onClick={openModal}>
              Добавить пользователя
            </Button>
            {showChoice && (
              <Button variant="contained" onClick={restoreAllOrganization}>
                Сбросить выборку{' '}
              </Button>
            )}
          </Box>
          <ModalNewCustomer
            isOpen={isModalOpen}
            onClose={closeModal}
            onRegistrationCustomerSuccess={onRegistrationCustomerSuccess}
          />
          <ModalAboutOneCustomer isModalInfoOpen={isModalInfoOpen} onClose={closeInfoModal} oneCustomer={oneCustomer} />
        </Box>
      )}
    </Stack>
  );
}

async function fetchCustomers() {
  const result: any = await customersClient.getCustomers();
  return result?.data;
}

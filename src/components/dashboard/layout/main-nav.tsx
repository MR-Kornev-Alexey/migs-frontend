'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { List as ListIcon } from '@phosphor-icons/react';
import { usePopover } from '@/hooks/use-popover';

import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';
import { objectClient } from "@/components/dashboard/objects/object-client";
import { sensorsClient } from "@/components/dashboard/sensors/sensors-client";
import { addObjects } from "@/store/object-reducer";
import { addSensors } from "@/store/sensors-reducer";
import type { ApiResult } from "@/types/result-api";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";

export function MainNav(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>(); // Хук перемещён внутрь компонента
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const userPopover = usePopover<HTMLDivElement>();

  const reloadAllData = async () => {
    try {
      const objResult: any = await objectClient.getAllObjects();
      if (objResult.statusCode === 200) {
        dispatch(addObjects(objResult.allObjects));
      }

      const sensorResult: any = await sensorsClient.getAllSensors();
      if (sensorResult.statusCode === 200) {
        dispatch(addSensors(sensorResult.allSensors)); // Исправлен вызов редьюсера для сенсоров
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
          </Stack>
          <Stack display="flex" flexDirection="row">
            <Stack sx={{ alignItems: 'center', marginRight: 2, cursor: 'pointer' }} direction="row" spacing={2}>
              <Tooltip title="Обновление всех данных" arrow>
                <Avatar
                  onClick={reloadAllData}
                  src="/assets/migs/direct-download.svg"
                  sx={{ cursor: 'pointer' }}
                />
              </Tooltip>
            </Stack>
            <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
              <Tooltip title="Пользователь" arrow>
                <Avatar
                  onClick={userPopover.handleOpen}
                  ref={userPopover.anchorRef}
                  src="/assets/migs/user_avatar.png"
                  sx={{ cursor: 'pointer' }}
                />
              </Tooltip>
            </Stack>
          </Stack>

        </Stack>
      </Box>
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}

import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import { config } from '@/config';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {Notifications} from "@/components/notifications/notifications";

export const metadata = { title: `ООО НИИ МИГС | KIS MIGS | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <div>
        <Notifications />
      </div>
      <Grid container spacing={3}>
        <Grid lg={4} md={6} xs={12} />
        <Grid lg={8} md={6} xs={12} />
      </Grid>
    </Stack>
  );
}

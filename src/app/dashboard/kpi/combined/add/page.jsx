'use client';

import { Box, Button, Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import KpiCombinedNewEditForm from '../../../../../sections/KpiCombined/KpiCombined-new-edit-form';

const page = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Add Combined KPI"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'KPI Database', href: paths.dashboard.kpi.root },
            { name: 'Combined KPI', href: paths.dashboard.KpiCombined.root },
            { name: 'Add Combined KPI' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <KpiCombinedNewEditForm />
      </Container>
    </>
  );
};

export default page;

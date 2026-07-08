'use client';

import { Box, Button, Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import KpiNewEditForm from '../../../../sections/kpi/kpi-new-edit-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';

const page = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Add KPI"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'KPI Database', href: paths.dashboard.kpi.root },
            { name: 'Add KPI' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <KpiNewEditForm />
      </Container>
    </>
  );
};

export default page;

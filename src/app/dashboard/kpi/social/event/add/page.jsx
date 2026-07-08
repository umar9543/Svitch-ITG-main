'use client';

import { Box, Button, Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import KpiSocialEventNewEditForm from '../../../../../../sections/KpiSocialEvent/KpiSocialEvent-new-edit-form';

const page = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Add Social Event"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'KPI Database', href: paths.dashboard.kpi.root },
            { name: 'Social Event', href: paths.dashboard.KpiSocialEvent.root },
            { name: 'Add Social Event' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <KpiSocialEventNewEditForm />
      </Container>
    </>
  );
};

export default page;

'use client';

import { Box, Button, Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import KpiSocialWagesNewEditForm from '../../../../../../sections/KpiSocialWages/KpiSocialWages-new-edit-form';

const page = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Add Social Wages"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'KPI Database', href: paths.dashboard.kpi.root },
            { name: 'Social Wages', href: paths.dashboard.KpiSocialWages.root },
            { name: 'Add Social Wage' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <KpiSocialWagesNewEditForm />
      </Container>
    </>
  );
};

export default page;

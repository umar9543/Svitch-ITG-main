'use client';

import { Box, Button, Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import KpiSocialIndigatorNewEditForm from '../../../../../../sections/KpiSocialIndegator/KpiSocialIndigator-new-edit-form';

const page = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Add Social Indigators"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'KPI Database', href: paths.dashboard.kpi.root },
            { name: 'Social Indigators', href: paths.dashboard.KpiSocialIndigator.root },
            { name: 'Add Social Indigators' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <KpiSocialIndigatorNewEditForm />
      </Container>
    </>
  );
};

export default page;

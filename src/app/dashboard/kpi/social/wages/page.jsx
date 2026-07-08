'use client';

import { Box, Button, Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import { KpiSocialWagesListView } from '../../../../../sections/KpiSocialWages/view';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Social Wages"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'KPI Database', href: paths.dashboard.kpi.root },
            { name: 'Social Wages', href: paths.dashboard.KpiSocialWages.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={'/dashboard/kpi/social/wages/add'}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Social Wage
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <KpiSocialWagesListView />
      </Container>
    </>
  );
};

export default page;

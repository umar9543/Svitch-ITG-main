'use client';
import { Button } from '@mui/material';
import { Container } from '@mui/system';
import { KpiListView } from '../../../../sections/kpi/view';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="KPI Database"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'KPI Environmental', href: paths.dashboard.kpi.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={'/dashboard/kpi/add-kpi'}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New KPI
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <KpiListView />
      </Container>
    </>
  );
};

export default page;

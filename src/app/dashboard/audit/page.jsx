'use client';

import { KpiListView } from '../../../sections/kpi/view';
import { Box, Button, Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Kpi Database"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Kpi Database', href: paths.dashboard.kpi.root },
            // { name: 'List' },
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

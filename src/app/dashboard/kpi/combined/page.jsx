'use client';
import { Button } from '@mui/material';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { KpiCombinedListView } from '../../../../sections/KpiCombined/view';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Combined KPI Database"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'KPI Database', href: paths.dashboard.kpi.root },
            { name: 'Combined KPI', href: paths.dashboard.KpiCombined.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={'/dashboard/kpi/combined/add'}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Combined KPI
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <KpiCombinedListView />
      </Container>
    </>
  );
};

export default page;

'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _kpiCards } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import KpiCardList from '../kpi-card-list';

// ----------------------------------------------------------------------

export default function KpiCardsView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Kpi Cards"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Kpi', href: paths.dashboard.kpi.root },
          { name: 'Cards' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.kpi.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Kpi
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <KpiCardList kpis={_kpiCards} />
    </Container>
  );
}

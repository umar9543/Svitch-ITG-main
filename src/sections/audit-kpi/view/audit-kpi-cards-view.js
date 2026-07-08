'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _kpiCards } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AuditKpiCardList from '../audit-kpi-card-list';

// ----------------------------------------------------------------------

export default function AuditKpiCardsView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="AuditKpi Cards"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'AuditKpi', href: paths.dashboard.audit.root },
          { name: 'Cards' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.audit.kpi.create}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New AuditKpi
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AuditKpiCardList auditKpis={_kpiCards} />
    </Container>
  );
}

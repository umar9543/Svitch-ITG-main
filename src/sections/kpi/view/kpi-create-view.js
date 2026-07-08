'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import KpiNewEditForm from '../kpi-new-edit-form';

// ----------------------------------------------------------------------

export default function KpiCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new kpi"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Kpi',
            href: paths.dashboard.kpi.root,
          },
          { name: 'New kpi' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <KpiNewEditForm />
    </Container>
  );
}

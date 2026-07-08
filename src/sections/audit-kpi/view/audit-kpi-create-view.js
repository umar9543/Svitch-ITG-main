'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AuditKpiNewEditForm from '../audit-kpi-new-edit-form';

// ----------------------------------------------------------------------

export default function AuditKpiCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new audit-kpi"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'AuditKpi',
            href: paths.dashboard.audit.root,
          },
          { name: 'New audit-kpi' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AuditKpiNewEditForm />
    </Container>
  );
}

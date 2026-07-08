'use client';

import { Box, Button, Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import AuditKpiNewEditForm from '../../../../../../sections/audit-kpi/audit-kpi-new-edit-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
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
            { name: 'Audit Database', href: paths.dashboard.audit.root },
            { name: 'KPI', href: paths.dashboard.audit.kpi },
            { name: 'Add KPI' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <AuditKpiNewEditForm />
      </Container>
    </>
  );
};

export default page;

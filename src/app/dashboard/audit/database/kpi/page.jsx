'use client';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import AuditKpiListView from '../../../../../sections/audit-kpi/view/audit-kpi-list-view';
import { Container } from '@mui/system';
import { paths } from 'src/routes/paths';
import { Button } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

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
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={'/dashboard/audit/database/kpi/add-kpi'}
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
        <AuditKpiListView />
      </Container>
    </>
  );
};

export default page;

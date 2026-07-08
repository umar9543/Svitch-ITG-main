'use client';
import { Button } from '@mui/material';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { PreAuditReportListView } from '../../../../sections/PreAuditReport/view';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Pre Audit Report"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Audit Database', href: paths.dashboard.audit.root },
            { name: 'Pre Audit Report', href: paths.dashboard.audit.PreAuditReport },
            { name: 'List' },
          ]}
          // action={
          //   <Button
          //     component={RouterLink}
          //     href={'/dashboard/audit/PreAuditReport/add'}
          //     variant="contained"
          //     color="primary"
          //     startIcon={<Iconify icon="mingcute:add-line" />}
          //   >
          //     Add Pre Audit Report
          //   </Button>
          // }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <PreAuditReportListView />
      </Container>
    </>
  );
};

export default page;

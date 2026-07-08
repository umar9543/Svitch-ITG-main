'use client';
import { Button } from '@mui/material';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import PreAuditReportNewEditForm from '../../../../../sections/PreAuditReport/PreAuditReport-new-edit-form';

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
            { name: 'Add' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <PreAuditReportNewEditForm />
      </Container>
    </>
  );
};

export default page;

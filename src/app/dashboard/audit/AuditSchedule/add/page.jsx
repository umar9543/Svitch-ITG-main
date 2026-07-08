'use client';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import AuditScheduleNewEditForm from '../../../../../sections/AuditSchedule/AuditSchedule-new-edit-form';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Audit Schedule "
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Audit', href: paths.dashboard.audit.root },
            { name: 'Audit Schedule', href: paths.dashboard.AuditSchedule.root },
            { name: 'Add' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <AuditScheduleNewEditForm />
      </Container>
    </>
  );
};

export default page;

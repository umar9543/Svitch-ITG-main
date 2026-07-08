'use client';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { ComplianceStatusListView } from 'src/sections/compliance-status/view';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Compliance Status"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Supplier Database', href: paths.dashboard.supplier.root },
            { name: 'Compliance Status' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <ComplianceStatusListView />
      </Container>
    </>
  );
};

export default page;

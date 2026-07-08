'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import KpiCombinedNewEditForm from '../KpiCombined-new-edit-form';

// ----------------------------------------------------------------------

export default function KpiCombinedCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new KpiCombined"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'KpiCombined',
            href: paths.dashboard.KpiCombined.root,
          },
          { name: 'New KpiCombined' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <KpiCombinedNewEditForm />
    </Container>
  );
}

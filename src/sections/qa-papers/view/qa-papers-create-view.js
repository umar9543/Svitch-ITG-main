'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import QaPapersNewEditForm from '../qa-papers-new-edit-form';

// ----------------------------------------------------------------------

export default function QaPapersCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="New Question"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Qa Papers',
            href: paths.dashboard.qa.root,
          },
          { name: 'New Question' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <QaPapersNewEditForm />
    </Container>
  );
}

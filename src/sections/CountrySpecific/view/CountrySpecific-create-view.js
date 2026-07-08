'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CountrySpecificNewEditForm from '../CountrySpecific-new-edit-form';

// ----------------------------------------------------------------------

export default function CountrySpecificCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Social Indigator"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Social Indigator',
            href: paths.dashboard.CountrySpecific.root,
          },
          { name: 'New Kpi Social Indigator' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CountrySpecificNewEditForm />
    </Container>
  );
}

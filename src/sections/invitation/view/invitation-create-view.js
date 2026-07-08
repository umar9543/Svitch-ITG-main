'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import InvitationNewEditForm from '../invitation-new-edit-form';

// ----------------------------------------------------------------------

export default function InvitationCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new invitation"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Project Database',
            href: paths.dashboard.projectDatabase.root,
          },
          {
            name: 'Invitation',
            href: paths.dashboard.projectDatabase.invitation,
          },
          // { name: 'New invitation' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <InvitationNewEditForm />
    </Container>
  );
}

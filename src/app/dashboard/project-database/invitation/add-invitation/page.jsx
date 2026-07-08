'use client';
import { Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import InvitationNewEditForm from '../../../../../sections/invitation/invitation-new-edit-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

const page = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Add a new Invitation"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Project Database', href: paths.dashboard.projectDatabase.root },
            { name: 'Invitation', href: paths.dashboard.projectDatabase.invitation },
            { name: 'Add Invitation' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <InvitationNewEditForm />
      </Container>
    </>
  );
};

export default page;

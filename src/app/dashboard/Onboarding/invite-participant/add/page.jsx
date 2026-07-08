'use client';

import { Box, Button, Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import OnBoardingInviteNewEditForm from '../../../../../sections/OnBoardingInvite/OnBoardingInvite-new-edit-form';

const page = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Invite Participant"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Onboarding', href: paths.dashboard.OnBoarding.root },
            { name: 'Invite Participant', href: paths.dashboard.OnBoarding.inviteParticipant.root },
            { name: 'Add' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <OnBoardingInviteNewEditForm />
      </Container>
    </>
  );
};

export default page;

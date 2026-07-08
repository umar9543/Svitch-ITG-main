'use client';
import { Button } from '@mui/material';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { PreOnboardingListView } from 'src/sections/PreOnboarding/view';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {/* <CustomBreadcrumbs
          heading="Pre-Onboard"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Onboarding', href: paths.dashboard.OnBoarding.root },
            { name: 'Pre-Onboard', href: paths.dashboard.OnBoarding.inviteParticipant.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={'/dashboard/Onboarding/pre-onboarding/add'}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add Pre-Onboard Supplier
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        /> */}

        <PreOnboardingListView />
      </Container>
    </>
  );
};

export default page;

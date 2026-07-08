'use client';
import { Button } from '@mui/material';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { OnBoardingSelfListView } from '../../../../sections/OnBoardingSelf/view';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Self Assessment"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Onboarding', href: paths.dashboard.OnBoarding.root },
            { name: 'Self Assessment', href: paths.dashboard.OnBoarding.selfAssessment.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={'#'}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Invite Participants for Self Assessment
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <OnBoardingSelfListView />
      </Container>
    </>
  );
};

export default page;

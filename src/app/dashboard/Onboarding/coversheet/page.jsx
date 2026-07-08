'use client';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { OnBoardingCoversheetListView } from '../../../../sections/OnBoardingCoversheet/view';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Onboarding Coversheet"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Onboarding', href: paths.dashboard.OnBoarding.root },
            { name: 'Coversheet', href: paths.dashboard.OnBoarding.coversheet.root },
            { name: 'List' },
          ]}
          //   action={
          //     <Button
          //       component={RouterLink}
          //       href={'#'}
          //       variant="contained"
          //       color="primary"
          //       startIcon={<Iconify icon="mingcute:add-line" />}
          //     >
          //       Invite Participants for Coversheet
          //     </Button>
          //   }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <OnBoardingCoversheetListView />
      </Container>
    </>
  );
};

export default page;

'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _supplierCards } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import OnBoardingCoversheetCardList from '../OnBoardingCoversheet-card-list';

// ----------------------------------------------------------------------

export default function OnBoardingCoversheetCardsView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="OnBoardingCoversheet Cards"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Onboarding', href: paths.dashboard.on.root },
          { name: 'Onboarding', href: paths.dashboard.OnBoardingCoversheet.root },
          { name: 'Cards' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.OnBoardingCoversheet.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New OnBoardingCoversheet
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <OnBoardingCoversheetCardList suppliers={_supplierCards} />
    </Container>
  );
}

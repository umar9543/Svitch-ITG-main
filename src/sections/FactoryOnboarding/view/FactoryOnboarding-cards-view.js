'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _userCards } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import FactoryOnboardingCardList from '../FactoryOnboarding-card-list';

// ----------------------------------------------------------------------

export default function FactoryOnboardingCardsView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="FactoryOnboarding Cards"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Audit Database', href: paths.dashboard.audit.root },
          { name: 'Factory Onboarding', href: paths.dashboard.audit.FactoryOnboarding },
          { name: 'Cards' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={`${paths.dashboard.audit.FactoryOnboarding}/add`}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Factory Onboarding
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <FactoryOnboardingCardList FactoryOnboardings={_userCards} />
    </Container>
  );
}

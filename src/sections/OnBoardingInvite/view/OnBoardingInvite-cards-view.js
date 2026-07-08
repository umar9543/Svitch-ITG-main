'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _userCards } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import OnBoardingInviteCardList from '../OnBoardingInvite-card-list';

// ----------------------------------------------------------------------

export default function OnBoardingInviteCardsView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="OnBoardingInvite Cards"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'SocialIndigator', href: paths.dashboard.OnBoardingInvite.root },
          { name: 'Cards' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.OnBoardingInvite.add}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New OnBoardingInvite
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <OnBoardingInviteCardList OnBoardingInvites={_userCards} />
    </Container>
  );
}

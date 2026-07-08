'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _userCards } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CountryRatingCardList from '../CountryRating-card-list';

// ----------------------------------------------------------------------

export default function CountryRatingCardsView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="CountryRating Cards"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'SocialIndigator', href: paths.dashboard.CountryRating.root },
          { name: 'Cards' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.CountryRating.add}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New CountryRating
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CountryRatingCardList CountryRatings={_userCards} />
    </Container>
  );
}

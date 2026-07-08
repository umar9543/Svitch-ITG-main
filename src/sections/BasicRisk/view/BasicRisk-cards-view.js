'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _userCards } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import BasicRiskCardList from '../BasicRisk-card-list';

// ----------------------------------------------------------------------

export default function BasicRiskCardsView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="BasicRisk Cards"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'SocialIndigator', href: paths.dashboard.BasicRisk.root },
          { name: 'Cards' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.BasicRisk.add}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New BasicRisk
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <BasicRiskCardList BasicRisks={_userCards} />
    </Container>
  );
}

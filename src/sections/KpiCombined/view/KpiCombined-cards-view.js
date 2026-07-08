'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _userCards } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import KpiCombinedCardList from '../KpiCombined-card-list';

// ----------------------------------------------------------------------

export default function KpiCombinedCardsView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="KpiCombined Cards"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'KpiCombined', href: paths.dashboard.KpiCombined.root },
          { name: 'Cards' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.KpiCombined.add}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New KpiCombined
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <KpiCombinedCardList KpiCombineds={_userCards} />
    </Container>
  );
}

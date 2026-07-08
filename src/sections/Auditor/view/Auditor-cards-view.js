'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _userCards } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AuditorCardList from '../Auditor-card-list';

// ----------------------------------------------------------------------

export default function AuditorCardsView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Auditor Cards"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'SocialIndigator', href: paths.dashboard.Auditor.root },
          { name: 'Cards' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.Auditor.add}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Auditor
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AuditorCardList Auditors={_userCards} />
    </Container>
  );
}

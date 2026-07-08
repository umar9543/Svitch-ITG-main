'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _userCards } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import WorkshopMatrixCardList from '../WorkshopMatrix-card-list';

// ----------------------------------------------------------------------

export default function WorkshopMatrixCardsView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="WorkshopMatrix Cards"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'SocialIndigator', href: paths.dashboard.WorkshopMatrix.root },
          { name: 'Cards' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.WorkshopMatrix.add}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New WorkshopMatrix
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <WorkshopMatrixCardList WorkshopMatrixs={_userCards} />
    </Container>
  );
}

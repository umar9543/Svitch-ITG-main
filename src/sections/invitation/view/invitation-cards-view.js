'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _invitationCards } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import InvitationCardList from '../invitation-card-list';

// ----------------------------------------------------------------------

export default function InvitationCardsView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Invitation Cards"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Invitation', href: paths.dashboard.invitation.root },
          { name: 'Cards' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.invitation.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Invitation
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <InvitationCardList invitations={_invitationCards} />
    </Container>
  );
}

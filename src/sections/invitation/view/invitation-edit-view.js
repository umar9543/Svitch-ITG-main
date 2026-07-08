'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _invitationList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import InvitationNewEditForm from '../invitation-new-edit-form';

// ----------------------------------------------------------------------

export default function InvitationEditView({ id }) {
  const settings = useSettingsContext();

  const currentInvitation = _invitationList.find((invitation) => invitation.id === id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Invitation',
            href: paths.dashboard.invitation.root,
          },
          { name: currentInvitation?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <InvitationNewEditForm currentInvitation={currentInvitation} />
    </Container>
  );
}

InvitationEditView.propTypes = {
  id: PropTypes.string,
};

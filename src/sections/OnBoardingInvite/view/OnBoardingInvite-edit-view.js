'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import OnBoardingInviteNewEditForm from '../OnBoardingInvite-new-edit-form';

// ----------------------------------------------------------------------

export default function OnBoardingInviteEditView({ id }) {
  const settings = useSettingsContext();

  const currentOnBoardingInvite = _userList.find((user) => user.id === id);

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
            name: 'OnBoardingInvite',
            href: paths.dashboard.OnBoardingInvite.root,
          },
          { name: currentOnBoardingInvite?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <OnBoardingInviteNewEditForm currentOnBoardingInvite={currentOnBoardingInvite} />
    </Container>
  );
}

OnBoardingInviteEditView.propTypes = {
  id: PropTypes.string,
};

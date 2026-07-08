'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import OnBoardingPreorderNewEditForm from '../OnBoardingPreorder-new-edit-form';

// ----------------------------------------------------------------------

export default function OnBoardingPreorderEditView({ id }) {
  const settings = useSettingsContext();

  const currentOnBoardingPreorder = _userList.find((user) => user.id === id);

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
            name: 'OnBoardingPreorder',
            href: paths.dashboard.OnBoardingPreorder.root,
          },
          { name: currentOnBoardingPreorder?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <OnBoardingPreorderNewEditForm currentOnBoardingPreorder={currentOnBoardingPreorder} />
    </Container>
  );
}

OnBoardingPreorderEditView.propTypes = {
  id: PropTypes.string,
};

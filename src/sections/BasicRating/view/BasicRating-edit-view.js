'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import BasicRatingNewEditForm from '../BasicRating-new-edit-form';

// ----------------------------------------------------------------------

export default function BasicRatingEditView({ id }) {
  const settings = useSettingsContext();

  const currentBasicRating = _userList.find((user) => user.id === id);

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
            name: 'Basic Rating',
            href: paths.dashboard.BasicRating.root,
          },
          { name: currentBasicRating?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BasicRatingNewEditForm currentBasicRating={currentBasicRating} />
    </Container>
  );
}

BasicRatingEditView.propTypes = {
  id: PropTypes.string,
};

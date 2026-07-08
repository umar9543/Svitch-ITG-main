'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import NonCompliantRatingNewEditForm from '../NonCompliantRating-new-edit-form';

// ----------------------------------------------------------------------

export default function NonCompliantRatingEditView({ id }) {
  const settings = useSettingsContext();

  const currentNonCompliantRating = _userList.find((user) => user.id === id);

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
            name: 'NonCompliantRating',
            href: paths.dashboard.NonCompliantRating.root,
          },
          { name: currentNonCompliantRating?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <NonCompliantRatingNewEditForm currentNonCompliantRating={currentNonCompliantRating} />
    </Container>
  );
}

NonCompliantRatingEditView.propTypes = {
  id: PropTypes.string,
};

'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CountryRatingNewEditForm from '../CountryRating-new-edit-form';

// ----------------------------------------------------------------------

export default function CountryRatingEditView({ id }) {
  const settings = useSettingsContext();

  const currentCountryRating = _userList.find((user) => user.id === id);

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
            name: 'CountryRating',
            href: paths.dashboard.CountryRating.root,
          },
          { name: currentCountryRating?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CountryRatingNewEditForm currentCountryRating={currentCountryRating} />
    </Container>
  );
}

CountryRatingEditView.propTypes = {
  id: PropTypes.string,
};

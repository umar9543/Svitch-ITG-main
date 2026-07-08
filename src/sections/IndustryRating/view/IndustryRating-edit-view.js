'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import IndustryRatingNewEditForm from '../IndustryRating-new-edit-form';

// ----------------------------------------------------------------------

export default function IndustryRatingEditView({ id }) {
  const settings = useSettingsContext();

  const currentIndustryRating = _userList.find((user) => user.id === id);

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
            name: 'IndustryRating',
            href: paths.dashboard.IndustryRating.root,
          },
          { name: currentIndustryRating?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <IndustryRatingNewEditForm currentIndustryRating={currentIndustryRating} />
    </Container>
  );
}

IndustryRatingEditView.propTypes = {
  id: PropTypes.string,
};

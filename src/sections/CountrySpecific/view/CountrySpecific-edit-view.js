'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CountrySpecificNewEditForm from '../CountrySpecific-new-edit-form';

// ----------------------------------------------------------------------

export default function CountrySpecificEditView({ id }) {
  const settings = useSettingsContext();

  const currentCountrySpecific = _userList.find((user) => user.id === id);

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
            name: 'CountrySpecific',
            href: paths.dashboard.CountrySpecific.root,
          },
          { name: currentCountrySpecific?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CountrySpecificNewEditForm currentCountrySpecific={currentCountrySpecific} />
    </Container>
  );
}

CountrySpecificEditView.propTypes = {
  id: PropTypes.string,
};

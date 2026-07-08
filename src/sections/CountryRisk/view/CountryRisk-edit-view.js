'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CountryRiskNewEditForm from '../CountryRisk-new-edit-form';

// ----------------------------------------------------------------------

export default function CountryRiskEditView({ id }) {
  const settings = useSettingsContext();

  const currentCountryRisk = _userList.find((user) => user.id === id);

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
            name: 'CountryRisk',
            href: paths.dashboard.CountryRisk.root,
          },
          { name: currentCountryRisk?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CountryRiskNewEditForm currentCountryRisk={currentCountryRisk} />
    </Container>
  );
}

CountryRiskEditView.propTypes = {
  id: PropTypes.string,
};

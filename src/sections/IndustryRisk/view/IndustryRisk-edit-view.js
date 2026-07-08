'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import IndustryRiskNewEditForm from '../IndustryRisk-new-edit-form';

// ----------------------------------------------------------------------

export default function IndustryRiskEditView({ id }) {
  const settings = useSettingsContext();

  const currentIndustryRisk = _userList.find((user) => user.id === id);

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
            name: 'IndustryRisk',
            href: paths.dashboard.IndustryRisk.root,
          },
          { name: currentIndustryRisk?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <IndustryRiskNewEditForm currentIndustryRisk={currentIndustryRisk} />
    </Container>
  );
}

IndustryRiskEditView.propTypes = {
  id: PropTypes.string,
};

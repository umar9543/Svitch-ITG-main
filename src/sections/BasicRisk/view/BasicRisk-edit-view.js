'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import BasicRiskNewEditForm from '../BasicRisk-new-edit-form';

// ----------------------------------------------------------------------

export default function BasicRiskEditView({ id }) {
  const settings = useSettingsContext();

  const currentBasicRisk = _userList.find((user) => user.id === id);

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
            name: 'BasicRisk',
            href: paths.dashboard.BasicRisk.root,
          },
          { name: currentBasicRisk?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BasicRiskNewEditForm currentBasicRisk={currentBasicRisk} />
    </Container>
  );
}

BasicRiskEditView.propTypes = {
  id: PropTypes.string,
};

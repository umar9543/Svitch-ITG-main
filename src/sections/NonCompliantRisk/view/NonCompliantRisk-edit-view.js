'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import NonCompliantRiskNewEditForm from '../NonCompliantRisk-new-edit-form';

// ----------------------------------------------------------------------

export default function NonCompliantRiskEditView({ id }) {
  const settings = useSettingsContext();

  const currentNonCompliantRisk = _userList.find((user) => user.id === id);

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
            name: 'NonCompliantRisk',
            href: paths.dashboard.NonCompliantRisk.root,
          },
          { name: currentNonCompliantRisk?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <NonCompliantRiskNewEditForm currentNonCompliantRisk={currentNonCompliantRisk} />
    </Container>
  );
}

NonCompliantRiskEditView.propTypes = {
  id: PropTypes.string,
};

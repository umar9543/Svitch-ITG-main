'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import FactorMappingNewEditForm from '../FactorMapping-new-edit-form';

// ----------------------------------------------------------------------

export default function FactorMappingEditView({ id }) {
  const settings = useSettingsContext();

  const currentFactorMapping = _userList.find((user) => user.id === id);

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
            name: 'FactorMapping',
            href: paths.dashboard.FactorMapping.root,
          },
          { name: currentFactorMapping?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <FactorMappingNewEditForm currentFactorMapping={currentFactorMapping} />
    </Container>
  );
}

FactorMappingEditView.propTypes = {
  id: PropTypes.string,
};

'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import KpiCombinedNewEditForm from '../KpiCombined-new-edit-form';

// ----------------------------------------------------------------------

export default function KpiCombinedEditView({ id }) {
  const settings = useSettingsContext();

  const currentKpiCombined = _userList.find((user) => user.id === id);

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
            name: 'KpiCombined',
            href: paths.dashboard.KpiCombined.root,
          },
          { name: currentKpiCombined?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <KpiCombinedNewEditForm currentKpiCombined={currentKpiCombined} />
    </Container>
  );
}

KpiCombinedEditView.propTypes = {
  id: PropTypes.string,
};

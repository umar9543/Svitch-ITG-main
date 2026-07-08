'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import KpiSocialWagesNewEditForm from '../KpiSocialWages-new-edit-form';

// ----------------------------------------------------------------------

export default function KpiSocialWagesEditView({ id }) {
  const settings = useSettingsContext();

  const currentKpiSocialWages = _userList.find((user) => user.id === id);

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
            name: 'KpiSocialWages',
            href: paths.dashboard.KpiSocialWages.root,
          },
          { name: currentKpiSocialWages?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <KpiSocialWagesNewEditForm currentKpiSocialWages={currentKpiSocialWages} />
    </Container>
  );
}

KpiSocialWagesEditView.propTypes = {
  id: PropTypes.string,
};

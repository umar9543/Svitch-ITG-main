'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import KpiSocialIndigatorNewEditForm from '../KpiSocialIndigator-new-edit-form';

// ----------------------------------------------------------------------

export default function KpiSocialIndigatorEditView({ id }) {
  const settings = useSettingsContext();

  const currentKpiSocialIndigator = _userList.find((user) => user.id === id);

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
            name: 'KpiSocialIndigator',
            href: paths.dashboard.KpiSocialIndigator.root,
          },
          { name: currentKpiSocialIndigator?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <KpiSocialIndigatorNewEditForm currentKpiSocialIndigator={currentKpiSocialIndigator} />
    </Container>
  );
}

KpiSocialIndigatorEditView.propTypes = {
  id: PropTypes.string,
};

'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import KpiSocialEventNewEditForm from '../KpiSocialEvent-new-edit-form';

// ----------------------------------------------------------------------

export default function KpiSocialEventEditView({ id }) {
  const settings = useSettingsContext();

  const currentKpiSocialEvent = _userList.find((user) => user.id === id);

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
            name: 'KpiSocialEvent',
            href: paths.dashboard.KpiSocialEvent.root,
          },
          { name: currentKpiSocialEvent?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <KpiSocialEventNewEditForm currentKpiSocialEvent={currentKpiSocialEvent} />
    </Container>
  );
}

KpiSocialEventEditView.propTypes = {
  id: PropTypes.string,
};

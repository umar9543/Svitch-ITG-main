'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import WorkshopNewEditForm from '../Workshop-new-edit-form';

// ----------------------------------------------------------------------

export default function WorkshopEditView({ id }) {
  const settings = useSettingsContext();

  const currentWorkshop = _userList.find((user) => user.id === id);

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
            name: 'Workshop',
            href: paths.dashboard.Workshop.root,
          },
          { name: currentWorkshop?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <WorkshopNewEditForm currentWorkshop={currentWorkshop} />
    </Container>
  );
}

WorkshopEditView.propTypes = {
  id: PropTypes.string,
};

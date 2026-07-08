'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AuditScheduleNewEditForm from '../AuditSchedule-new-edit-form';

// ----------------------------------------------------------------------

export default function AuditScheduleEditView({ id }) {
  const settings = useSettingsContext();

  const currentAuditSchedule = _userList.find((user) => user.id === id);

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
            name: 'AuditSchedule',
            href: paths.dashboard.AuditSchedule.root,
          },
          { name: currentAuditSchedule?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AuditScheduleNewEditForm currentAuditSchedule={currentAuditSchedule} />
    </Container>
  );
}

AuditScheduleEditView.propTypes = {
  id: PropTypes.string,
};

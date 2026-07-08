'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import PreAuditReportNewEditForm from '../PreAuditReport-new-edit-form';

// ----------------------------------------------------------------------

export default function PreAuditReportEditView({ id }) {
  const settings = useSettingsContext();

  const currentPreAuditReport = _userList.find((user) => user.id === id);

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
            name: 'Audit Database',
            href: paths.dashboard.audit.root,
          },
          {
            name: 'Pre Audit Report',
            href: paths.dashboard.audit.PreAuditReport,
          },
          { name: currentPreAuditReport?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PreAuditReportNewEditForm currentPreAuditReport={currentPreAuditReport} />
    </Container>
  );
}

PreAuditReportEditView.propTypes = {
  id: PropTypes.string,
};

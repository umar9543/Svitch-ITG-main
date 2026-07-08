'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AuditSchemeNewEditForm from '../AuditScheme-new-edit-form';

// ----------------------------------------------------------------------

export default function AuditSchemeEditView({ id }) {
  const settings = useSettingsContext();

  const currentAuditScheme = _userList.find((user) => user.id === id);

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
            name: 'Audit',
            href: paths.dashboard.audit.root,
          },
          {
            name: 'Factory Onboarding',
            href: paths.dashboard.audit.AuditScheme,
          },
          { name: currentAuditScheme?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AuditSchemeNewEditForm currentAuditScheme={currentAuditScheme} />
    </Container>
  );
}

AuditSchemeEditView.propTypes = {
  id: PropTypes.string,
};

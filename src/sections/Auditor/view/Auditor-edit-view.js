'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AuditorNewEditForm from '../Auditor-new-edit-form';

// ----------------------------------------------------------------------

export default function AuditorEditView({ id }) {
  const settings = useSettingsContext();

  const currentAuditor = _userList.find((user) => user.id === id);

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
            name: 'Auditor',
            href: paths.dashboard.Auditor.root,
          },
          { name: currentAuditor?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AuditorNewEditForm currentAuditor={currentAuditor} />
    </Container>
  );
}

AuditorEditView.propTypes = {
  id: PropTypes.string,
};

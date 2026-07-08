'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CertificateNewEditForm from '../Certificate-new-edit-form';

// ----------------------------------------------------------------------

export default function CertificateEditView({ id }) {
  const settings = useSettingsContext();

  const currentCertificate = _userList.find((user) => user.id === id);

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
            name: 'Certificate',
            href: paths.dashboard.Certificate.root,
          },
          { name: currentCertificate?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CertificateNewEditForm currentCertificate={currentCertificate} />
    </Container>
  );
}

CertificateEditView.propTypes = {
  id: PropTypes.string,
};

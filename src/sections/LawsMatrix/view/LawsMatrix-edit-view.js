'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import LawsMatrixNewEditForm from '../LawsMatrix-new-edit-form';

// ----------------------------------------------------------------------

export default function LawsMatrixEditView({ id }) {
  const settings = useSettingsContext();

  const currentLawsMatrix = _userList.find((user) => user.id === id);

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
            name: 'LawsMatrix',
            href: paths.dashboard.LawsMatrix.root,
          },
          { name: currentLawsMatrix?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <LawsMatrixNewEditForm currentLawsMatrix={currentLawsMatrix} />
    </Container>
  );
}

LawsMatrixEditView.propTypes = {
  id: PropTypes.string,
};

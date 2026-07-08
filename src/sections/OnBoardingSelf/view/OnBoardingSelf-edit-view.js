'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import OnBoardingSelfNewEditForm from '../OnBoardingSelf-new-edit-form';

// ----------------------------------------------------------------------

export default function OnBoardingSelfEditView({ id }) {
  const settings = useSettingsContext();

  const currentOnBoardingSelf = _userList.find((user) => user.id === id);

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
            name: 'OnBoardingSelf',
            href: paths.dashboard.OnBoardingSelf.root,
          },
          { name: currentOnBoardingSelf?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <OnBoardingSelfNewEditForm currentOnBoardingSelf={currentOnBoardingSelf} />
    </Container>
  );
}

OnBoardingSelfEditView.propTypes = {
  id: PropTypes.string,
};

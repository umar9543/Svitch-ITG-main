'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import LawsNewEditForm from '../Laws-new-edit-form';

// ----------------------------------------------------------------------

export default function LawsEditView({ id }) {
  const settings = useSettingsContext();

  const currentLaws = _userList.find((user) => user.id === id);

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
            name: 'Laws',
            href: paths.dashboard.Laws.root,
          },
          { name: currentLaws?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <LawsNewEditForm currentLaws={currentLaws} />
    </Container>
  );
}

LawsEditView.propTypes = {
  id: PropTypes.string,
};

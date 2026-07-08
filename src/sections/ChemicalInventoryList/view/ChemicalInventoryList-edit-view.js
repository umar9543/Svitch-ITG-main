'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ChemicalInventoryListNewEditForm from '../ChemicalInventoryList-new-edit-form';

// ----------------------------------------------------------------------

export default function ChemicalInventoryListEditView({ id }) {
  const settings = useSettingsContext();

  const currentChemicalInventoryList = _userList.find((user) => user.id === id);

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
            href: paths.dashboard.audit.ChemicalInventoryList,
          },
          { name: currentChemicalInventoryList?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ChemicalInventoryListNewEditForm currentChemicalInventoryList={currentChemicalInventoryList} />
    </Container>
  );
}

ChemicalInventoryListEditView.propTypes = {
  id: PropTypes.string,
};

'use client';

import { Box, Button, Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import ChemicalInventoryListNewEditForm from '../../../../../../sections/ChemicalInventoryList/ChemicalInventoryList-new-edit-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';

const page = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Add Chemical Inventory "
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Audit Database', href: paths.dashboard.audit.root },
            { name: 'Chemical Inventory ', href: paths.dashboard.audit.ChemicalInventoryList },
            { name: 'Add' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <ChemicalInventoryListNewEditForm />
      </Container>
    </>
  );
};

export default page;

'use client';
import { Button } from '@mui/material';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { ChemicalInventoryListListView } from '../../../../../sections/ChemicalInventoryList/view';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Chemical Inventory List "
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Audit Database', href: paths.dashboard.audit.root },
            { name: 'Chemical Inventory ', href: paths.dashboard.audit.ChemicalInventoryList },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={'/dashboard/audit/database/ChemicalInventoryList/add'}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add Chemical Inventory
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <ChemicalInventoryListListView />
      </Container>
    </>
  );
};

export default page;

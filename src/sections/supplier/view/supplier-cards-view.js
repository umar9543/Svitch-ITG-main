'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _supplierCards } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import SupplierCardList from '../supplier-card-list';

// ----------------------------------------------------------------------

export default function SupplierCardsView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Supplier Cards"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Supplier', href: paths.dashboard.supplier.root },
          { name: 'Cards' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.supplier.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Supplier
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <SupplierCardList suppliers={_supplierCards} />
    </Container>
  );
}

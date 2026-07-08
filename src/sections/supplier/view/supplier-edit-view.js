'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _supplierList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import SupplierNewEditForm from '../supplier-new-edit-form';

// ----------------------------------------------------------------------

export default function SupplierEditView({ id }) {
  const settings = useSettingsContext();

  const currentSupplier = _supplierList.find((supplier) => supplier.id === id);

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
            name: 'Supplier',
            href: paths.dashboard.supplier.root,
          },
          { name: currentSupplier?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SupplierNewEditForm currentSupplier={currentSupplier} />
    </Container>
  );
}

SupplierEditView.propTypes = {
  id: PropTypes.string,
};

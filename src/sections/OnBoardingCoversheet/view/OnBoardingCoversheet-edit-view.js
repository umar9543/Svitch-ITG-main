'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _supplierList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import OnBoardingCoversheetNewEditForm from '../OnBoardingCoversheet-new-edit-form';

// ----------------------------------------------------------------------

export default function OnBoardingCoversheetEditView({ id }) {
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
            name: 'OnBoardingCoversheet',
            href: paths.dashboard.OnBoardingCoversheet.root,
          },
          { name: currentSupplier?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <OnBoardingCoversheetNewEditForm currentSupplier={currentSupplier} />
    </Container>
  );
}

OnBoardingCoversheetEditView.propTypes = {
  id: PropTypes.string,
};

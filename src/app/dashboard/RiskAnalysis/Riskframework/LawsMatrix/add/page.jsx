'use client';
import { Button } from '@mui/material';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import LawsMatrixNewEditForm from 'src/sections/LawsMatrix/LawsMatrix-new-edit-form';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Risk Matrix "
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.Riskframework.LawsMatrix.root },
            { name: 'Risk Matrix', href: paths.dashboard.RiskAnalysis.Riskframework.LawsMatrix.root },
            { name: 'Add' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <LawsMatrixNewEditForm />
      </Container>
    </>
  );
};

export default page;

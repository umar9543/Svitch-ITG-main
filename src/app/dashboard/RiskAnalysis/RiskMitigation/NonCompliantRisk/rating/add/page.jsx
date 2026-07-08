'use client';
import { Button } from '@mui/material';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import NonCompliantRatingNewEditForm from 'src/sections/NonCompliantRating/NonCompliantRating-new-edit-form';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Non-Compliant Risk By PA"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.root },
            // { name: 'NonCompliant Risk', href: paths.dashboard.RiskAnalysis.RiskFactor.NonCompliantRisk.root },
            {
              name: 'Non-Compliant Risk By PA',
              href: paths.dashboard.RiskAnalysis.RiskFactor.NonCompliantRisk.rating.root,
            },
            { name: 'Add ' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <NonCompliantRatingNewEditForm />
      </Container>
    </>
  );
};

export default page;

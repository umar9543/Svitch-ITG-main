'use client';
import { Button } from '@mui/material';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import CountryRatingNewEditForm from 'src/sections/CountryRating/CountryRating-new-edit-form';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Country Risk By PA"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.root },
            // { name: 'Country Risk', href: paths.dashboard.RiskAnalysis.RiskFactor.CountryRisk.root },
            {
              name: 'Country Risk By PA',
              href: paths.dashboard.RiskAnalysis.RiskFactor.CountryRisk.rating.root,
            },
            { name: 'Add ' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <CountryRatingNewEditForm />
      </Container>
    </>
  );
};

export default page;

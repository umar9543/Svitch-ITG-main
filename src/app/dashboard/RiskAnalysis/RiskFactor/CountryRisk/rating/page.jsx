'use client';
import { Button } from '@mui/material';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { CountryRatingListView } from 'src/sections/CountryRating/view';

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
            { name: 'Country Risk By PA' },
            // { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={'/dashboard/RiskAnalysis/RiskFactor/CountryRisk/rating/add'}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <CountryRatingListView />
      </Container>
    </>
  );
};

export default page;

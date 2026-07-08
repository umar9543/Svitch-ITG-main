'use client';
import { Button } from '@mui/material';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { IndustryRatingListView } from 'src/sections/IndustryRating/view';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Industry Risk By PA"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.root },
            // { name: 'Industry Risk', href: paths.dashboard.RiskAnalysis.RiskFactor.IndustryRisk.root },
            { name: 'Industry Risk By PA' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={'/dashboard/RiskAnalysis/RiskFactor/IndustryRisk/rating/add'}
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

        <IndustryRatingListView />
      </Container>
    </>
  );
};

export default page;

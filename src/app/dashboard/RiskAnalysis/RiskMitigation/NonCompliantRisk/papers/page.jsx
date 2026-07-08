'use client';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { Container } from '@mui/system';
import { paths } from 'src/routes/paths';
import { Button } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { QaPapersListView } from 'src/sections/qa-papers/view';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Survey"
          links={[
            // { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.root },
            { name: 'Survey', href: paths.dashboard.RiskAnalysis.RiskMitigation.papers.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={`${paths.dashboard.RiskAnalysis.RiskMitigation.papers.addPaper}`}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Create Survey
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <QaPapersListView />
      </Container>
    </>
  );
};

export default page;

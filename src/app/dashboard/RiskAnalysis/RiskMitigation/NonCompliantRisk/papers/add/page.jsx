'use client';

import { Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import QaPapersNewEditForm from 'src/sections/qa-papers/qa-papers-new-edit-form';

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
            {
              name: 'Survey',
              href: paths.dashboard.RiskAnalysis.RiskMitigation.papers.root,
            },
            { name: 'Create Survey' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <QaPapersNewEditForm />
      </Container>
    </>
  );
};

export default page;

'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import QaQuestionariesProjectNewEditForm from '../qa-questionaries-project-new-edit-form';

// ----------------------------------------------------------------------

export default function QaQuestionariesCreateProjectView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create Questionnaire"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Qa Questionaries',
            href: paths.dashboard.qa.root,
          },
          { name: 'Create Questionnaire' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <QaQuestionariesProjectNewEditForm />
    </Container>
  );
}

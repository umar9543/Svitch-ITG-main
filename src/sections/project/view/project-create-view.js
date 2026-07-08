'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProjectNewEditForm from '../project-new-edit-form';

// ----------------------------------------------------------------------

export default function ProjectCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new project"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Project',
            href: paths.dashboard.project.root,
          },
          { name: 'New project' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProjectNewEditForm />
    </Container>
  );
}

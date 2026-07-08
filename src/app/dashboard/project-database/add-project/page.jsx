'use client';
import { Box, Button, Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import ProjectNewEditForm from '../../../../sections/project/project-new-edit-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';

const page = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Add Project"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Project Database', href: paths.dashboard.projectDatabase.root },
            { name: 'Add Project' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <ProjectNewEditForm />
      </Container>
    </>
  );
};

export default page;

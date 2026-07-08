'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _projectCards } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProjectCardList from '../project-card-list';

// ----------------------------------------------------------------------

export default function ProjectCardsView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Project Cards"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Project', href: paths.dashboard.project.root },
          { name: 'Cards' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.project.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Project
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProjectCardList projects={_projectCards} />
    </Container>
  );
}

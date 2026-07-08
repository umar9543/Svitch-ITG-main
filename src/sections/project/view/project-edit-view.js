'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _projectList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProjectNewEditForm from '../project-new-edit-form';

// ----------------------------------------------------------------------

export default function ProjectEditView({ id }) {
  const settings = useSettingsContext();

  const currentProject = _projectList.find((project) => project.id === id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Project',
            href: paths.dashboard.project.root,
          },
          { name: currentProject?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProjectNewEditForm currentProject={currentProject} />
    </Container>
  );
}

ProjectEditView.propTypes = {
  id: PropTypes.string,
};

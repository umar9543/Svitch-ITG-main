import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import ProjectCard from './project-card';

// ----------------------------------------------------------------------

export default function ProjectCardList({ projects }) {
  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </Box>
  );
}

ProjectCardList.propTypes = {
  projects: PropTypes.array,
};

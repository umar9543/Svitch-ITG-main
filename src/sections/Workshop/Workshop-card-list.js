import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import WorkshopCard from './Workshop-card';

// ----------------------------------------------------------------------

export default function WorkshopCardList({ Workshops }) {
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
      {Workshops.map((Workshop) => (
        <WorkshopCard key={Workshop.id} Workshop={Workshop} />
      ))}
    </Box>
  );
}

WorkshopCardList.propTypes = {
  Workshops: PropTypes.array,
};

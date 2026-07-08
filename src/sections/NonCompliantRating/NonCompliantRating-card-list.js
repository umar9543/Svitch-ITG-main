import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import NonCompliantRatingCard from './NonCompliantRating-card';

// ----------------------------------------------------------------------

export default function NonCompliantRatingCardList({ NonCompliantRatings }) {
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
      {NonCompliantRatings.map((NonCompliantRating) => (
        <NonCompliantRatingCard
          key={NonCompliantRating.id}
          NonCompliantRating={NonCompliantRating}
        />
      ))}
    </Box>
  );
}

NonCompliantRatingCardList.propTypes = {
  NonCompliantRatings: PropTypes.array,
};

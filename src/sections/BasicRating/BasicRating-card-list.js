import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import BasicRatingCard from './BasicRating-card';

// ----------------------------------------------------------------------

export default function BasicRatingCardList({ BasicRatings }) {
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
      {BasicRatings.map((BasicRating) => (
        <BasicRatingCard key={BasicRating.id} BasicRating={BasicRating} />
      ))}
    </Box>
  );
}

BasicRatingCardList.propTypes = {
  BasicRatings: PropTypes.array,
};

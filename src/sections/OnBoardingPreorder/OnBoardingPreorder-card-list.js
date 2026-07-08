import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import OnBoardingPreorderCard from './OnBoardingPreorder-card';

// ----------------------------------------------------------------------

export default function OnBoardingPreorderCardList({ OnBoardingPreorders }) {
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
      {OnBoardingPreorders.map((OnBoardingPreorder) => (
        <OnBoardingPreorderCard
          key={OnBoardingPreorder.id}
          OnBoardingPreorder={OnBoardingPreorder}
        />
      ))}
    </Box>
  );
}

OnBoardingPreorderCardList.propTypes = {
  OnBoardingPreorders: PropTypes.array,
};

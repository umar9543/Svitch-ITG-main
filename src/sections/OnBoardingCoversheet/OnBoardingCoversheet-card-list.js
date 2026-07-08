import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import OnBoardingCoversheetCard from './OnBoardingCoversheet-card';

// ----------------------------------------------------------------------

export default function OnBoardingCoversheetCardList({ suppliers }) {
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
      {suppliers.map((supplier) => (
        <OnBoardingCoversheetCard key={supplier.id} supplier={supplier} />
      ))}
    </Box>
  );
}

OnBoardingCoversheetCardList.propTypes = {
  suppliers: PropTypes.array,
};

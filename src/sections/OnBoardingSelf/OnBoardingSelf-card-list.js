import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import OnBoardingSelfCard from './OnBoardingSelf-card';

// ----------------------------------------------------------------------

export default function OnBoardingSelfCardList({ OnBoardingSelfs }) {
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
      {OnBoardingSelfs.map((OnBoardingSelf) => (
        <OnBoardingSelfCard key={OnBoardingSelf.id} OnBoardingSelf={OnBoardingSelf} />
      ))}
    </Box>
  );
}

OnBoardingSelfCardList.propTypes = {
  OnBoardingSelfs: PropTypes.array,
};

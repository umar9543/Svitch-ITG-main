import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import OnBoardingInviteCard from './OnBoardingInvite-card';

// ----------------------------------------------------------------------

export default function OnBoardingInviteCardList({ OnBoardingInvites }) {
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
      {OnBoardingInvites.map((OnBoardingInvite) => (
        <OnBoardingInviteCard key={OnBoardingInvite.id} OnBoardingInvite={OnBoardingInvite} />
      ))}
    </Box>
  );
}

OnBoardingInviteCardList.propTypes = {
  OnBoardingInvites: PropTypes.array,
};

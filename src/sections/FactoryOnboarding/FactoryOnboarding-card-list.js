import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import FactoryOnboardingCard from './FactoryOnboarding-card';

// ----------------------------------------------------------------------

export default function FactoryOnboardingCardList({ FactoryOnboardings }) {
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
      {FactoryOnboardings.map((FactoryOnboarding) => (
        <FactoryOnboardingCard key={FactoryOnboarding.id} FactoryOnboarding={FactoryOnboarding} />
      ))}
    </Box>
  );
}

FactoryOnboardingCardList.propTypes = {
  FactoryOnboardings: PropTypes.array,
};

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import CountryRiskCard from './CountryRisk-card';

// ----------------------------------------------------------------------

export default function CountryRiskCardList({ CountryRisks }) {
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
      {CountryRisks.map((CountryRisk) => (
        <CountryRiskCard key={CountryRisk.id} CountryRisk={CountryRisk} />
      ))}
    </Box>
  );
}

CountryRiskCardList.propTypes = {
  CountryRisks: PropTypes.array,
};

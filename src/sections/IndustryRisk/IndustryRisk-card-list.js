import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import IndustryRiskCard from './IndustryRisk-card';

// ----------------------------------------------------------------------

export default function IndustryRiskCardList({ IndustryRisks }) {
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
      {IndustryRisks.map((IndustryRisk) => (
        <IndustryRiskCard key={IndustryRisk.id} IndustryRisk={IndustryRisk} />
      ))}
    </Box>
  );
}

IndustryRiskCardList.propTypes = {
  IndustryRisks: PropTypes.array,
};

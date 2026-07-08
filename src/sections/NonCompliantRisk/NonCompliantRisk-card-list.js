import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import NonCompliantRiskCard from './NonCompliantRisk-card';

// ----------------------------------------------------------------------

export default function NonCompliantRiskCardList({ NonCompliantRisks }) {
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
      {NonCompliantRisks.map((NonCompliantRisk) => (
        <NonCompliantRiskCard key={NonCompliantRisk.id} NonCompliantRisk={NonCompliantRisk} />
      ))}
    </Box>
  );
}

NonCompliantRiskCardList.propTypes = {
  NonCompliantRisks: PropTypes.array,
};

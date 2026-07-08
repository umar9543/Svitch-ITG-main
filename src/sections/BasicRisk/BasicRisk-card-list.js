import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import BasicRiskCard from './BasicRisk-card';

// ----------------------------------------------------------------------

export default function BasicRiskCardList({ BasicRisks }) {
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
      {BasicRisks.map((BasicRisk) => (
        <BasicRiskCard key={BasicRisk.id} BasicRisk={BasicRisk} />
      ))}
    </Box>
  );
}

BasicRiskCardList.propTypes = {
  BasicRisks: PropTypes.array,
};

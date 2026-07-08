import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import FactorMappingCard from './FactorMapping-card';

// ----------------------------------------------------------------------

export default function FactorMappingCardList({ FactorMappings }) {
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
      {FactorMappings.map((FactorMapping) => (
        <FactorMappingCard key={FactorMapping.id} FactorMapping={FactorMapping} />
      ))}
    </Box>
  );
}

FactorMappingCardList.propTypes = {
  FactorMappings: PropTypes.array,
};

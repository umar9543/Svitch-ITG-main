import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import KpiCombinedCard from './KpiCombined-card';

// ----------------------------------------------------------------------

export default function KpiCombinedCardList({ KpiCombineds }) {
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
      {KpiCombineds.map((KpiCombined) => (
        <KpiCombinedCard key={KpiCombined.id} KpiCombined={KpiCombined} />
      ))}
    </Box>
  );
}

KpiCombinedCardList.propTypes = {
  KpiCombineds: PropTypes.array,
};

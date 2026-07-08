import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import KpiSocialIndigatorCard from './KpiSocialIndigator-card';

// ----------------------------------------------------------------------

export default function KpiSocialIndigatorCardList({ KpiSocialIndigators }) {
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
      {KpiSocialIndigators.map((KpiSocialIndigator) => (
        <KpiSocialIndigatorCard
          key={KpiSocialIndigator.id}
          KpiSocialIndigator={KpiSocialIndigator}
        />
      ))}
    </Box>
  );
}

KpiSocialIndigatorCardList.propTypes = {
  KpiSocialIndigators: PropTypes.array,
};

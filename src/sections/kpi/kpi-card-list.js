import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import KpiCard from './kpi-card';

// ----------------------------------------------------------------------

export default function KpiCardList({ kpis }) {
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
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </Box>
  );
}

KpiCardList.propTypes = {
  kpis: PropTypes.array,
};

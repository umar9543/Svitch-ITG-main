import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import KpiSocialEventCard from './KpiSocialEvent-card';

// ----------------------------------------------------------------------

export default function KpiSocialEventCardList({ KpiSocialEvents }) {
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
      {KpiSocialEvents.map((KpiSocialEvent) => (
        <KpiSocialEventCard key={KpiSocialEvent.id} KpiSocialEvent={KpiSocialEvent} />
      ))}
    </Box>
  );
}

KpiSocialEventCardList.propTypes = {
  KpiSocialEvents: PropTypes.array,
};

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import KpiSocialWagesCard from './KpiSocialWages-card';

// ----------------------------------------------------------------------

export default function KpiSocialWagesCardList({ KpiSocialWagess }) {
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
      {KpiSocialWagess.map((KpiSocialWages) => (
        <KpiSocialWagesCard key={KpiSocialWages.id} KpiSocialWages={KpiSocialWages} />
      ))}
    </Box>
  );
}

KpiSocialWagesCardList.propTypes = {
  KpiSocialWagess: PropTypes.array,
};

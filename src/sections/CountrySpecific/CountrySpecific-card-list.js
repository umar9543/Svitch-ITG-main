import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import CountrySpecificCard from './CountrySpecific-card';

// ----------------------------------------------------------------------

export default function CountrySpecificCardList({ CountrySpecifics }) {
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
      {CountrySpecifics.map((CountrySpecific) => (
        <CountrySpecificCard key={CountrySpecific.id} CountrySpecific={CountrySpecific} />
      ))}
    </Box>
  );
}

CountrySpecificCardList.propTypes = {
  CountrySpecifics: PropTypes.array,
};

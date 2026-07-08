import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import LawsCard from './Laws-card';

// ----------------------------------------------------------------------

export default function LawsCardList({ Lawss }) {
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
      {Lawss.map((Laws) => (
        <LawsCard key={Laws.id} Laws={Laws} />
      ))}
    </Box>
  );
}

LawsCardList.propTypes = {
  Lawss: PropTypes.array,
};

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import SupplierCard from './supplier-card';

// ----------------------------------------------------------------------

export default function SupplierCardList({ suppliers }) {
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
      {suppliers.map((supplier) => (
        <SupplierCard key={supplier.id} supplier={supplier} />
      ))}
    </Box>
  );
}

SupplierCardList.propTypes = {
  suppliers: PropTypes.array,
};

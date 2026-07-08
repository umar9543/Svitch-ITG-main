import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import AuditDBCard from './AuditDB-card';

// ----------------------------------------------------------------------

export default function AuditDBCardList({ AuditDBs }) {
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
      {AuditDBs.map((AuditDB) => (
        <AuditDBCard key={AuditDB.id} AuditDB={AuditDB} />
      ))}
    </Box>
  );
}

AuditDBCardList.propTypes = {
  AuditDBs: PropTypes.array,
};

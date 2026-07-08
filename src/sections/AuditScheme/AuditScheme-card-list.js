import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import AuditSchemeCard from './AuditScheme-card';

// ----------------------------------------------------------------------

export default function AuditSchemeCardList({ AuditSchemes }) {
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
      {AuditSchemes.map((AuditScheme) => (
        <AuditSchemeCard key={AuditScheme.id} AuditScheme={AuditScheme} />
      ))}
    </Box>
  );
}

AuditSchemeCardList.propTypes = {
  AuditSchemes: PropTypes.array,
};

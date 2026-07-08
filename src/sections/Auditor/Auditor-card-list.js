import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import AuditorCard from './Auditor-card';

// ----------------------------------------------------------------------

export default function AuditorCardList({ Auditors }) {
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
      {Auditors.map((Auditor) => (
        <AuditorCard key={Auditor.id} Auditor={Auditor} />
      ))}
    </Box>
  );
}

AuditorCardList.propTypes = {
  Auditors: PropTypes.array,
};

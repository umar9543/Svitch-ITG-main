import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import AuditScheduleCard from './AuditSchedule-card';

// ----------------------------------------------------------------------

export default function AuditScheduleCardList({ AuditSchedules }) {
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
      {AuditSchedules.map((AuditSchedule) => (
        <AuditScheduleCard key={AuditSchedule.id} AuditSchedule={AuditSchedule} />
      ))}
    </Box>
  );
}

AuditScheduleCardList.propTypes = {
  AuditSchedules: PropTypes.array,
};

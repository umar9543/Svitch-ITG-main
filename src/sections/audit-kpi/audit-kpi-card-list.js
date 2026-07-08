import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import AuditKpiCard from './audit-kpi-card';

// ----------------------------------------------------------------------

export default function AuditKpiCardList({ auditAuditKpis }) {
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
      {auditAuditKpis.map((kpi) => (
        <AuditKpiCard key={kpi.id} kpi={kpi} />
      ))}
    </Box>
  );
}

AuditKpiCardList.propTypes = {
  auditAuditKpis: PropTypes.array,
};

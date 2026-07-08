'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _kpiList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AuditKpiNewEditForm from '../audit-kpi-new-edit-form';

// ----------------------------------------------------------------------

export default function AuditKpiEditView({ id }) {
  const settings = useSettingsContext();

  const currentAuditKpi = _kpiList.find((kpi) => kpi.id === id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'AuditKpi',
            href: paths.dashboard.audit.root,
          },
          { name: currentAuditKpi?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AuditKpiNewEditForm currentAuditKpi={currentAuditKpi} />
    </Container>
  );
}

AuditKpiEditView.propTypes = {
  id: PropTypes.string,
};

'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import WorkshopParticipationForm from '../workshop-participation-form';

// ----------------------------------------------------------------------

export default function WorkshopParticipationView({ workshopId }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Workshop Participation"
        links={[
          { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.root },
          { name: 'Risk Mitigation', href: paths.dashboard.RiskAnalysis.RiskMitigation.root },
          { name: 'Workshop', href: paths.dashboard.RiskAnalysis.RiskMitigation.workshop.root },
          { name: 'Workshop Participation' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <WorkshopParticipationForm workshopId={workshopId} />
    </Container>
  );
}

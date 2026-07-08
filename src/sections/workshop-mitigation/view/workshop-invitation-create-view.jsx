'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import WorkshopInvitationForm from '../workshop-invitation-form';

// ----------------------------------------------------------------------

export default function WorkshopInvitationCreateView({ workshopId, currentWorkshop }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Workshop Invitation"
        links={[
          { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.root },
          { name: 'Risk Mitigation', href: paths.dashboard.RiskAnalysis.RiskMitigation.root },
          { name: 'Workshop', href: paths.dashboard.RiskAnalysis.RiskMitigation.workshop.root },
          { name: 'Workshop Invitation', href: paths.dashboard.RiskAnalysis.RiskMitigation.workshop.addInvitation },
          { name: currentWorkshop ? 'Edit' : 'New' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <WorkshopInvitationForm workshopId={workshopId} currentWorkshop={currentWorkshop} />
    </Container>
  );
}

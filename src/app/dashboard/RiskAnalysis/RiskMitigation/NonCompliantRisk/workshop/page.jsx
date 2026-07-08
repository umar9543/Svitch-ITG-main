'use client';

import { Button } from '@mui/material';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { WorkshopMitigationListView } from 'src/sections/workshop-mitigation/view';

export default function WorkshopListPage() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Workshop"
        links={[
          { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.root },
          { name: 'Risk Mitigation', href: paths.dashboard.RiskAnalysis.RiskMitigation.root },
          { name: 'Workshop', href: paths.dashboard.RiskAnalysis.RiskMitigation.workshop.root },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.RiskAnalysis.RiskMitigation.workshop.addInvitation}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Workshop Invitation
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <WorkshopMitigationListView />
    </Container>
  );
}

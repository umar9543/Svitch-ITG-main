'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import SurveyInviteNewEditForm from '../survey-invite-new-edit-form';

// ----------------------------------------------------------------------

export default function SurveyInviteCreateView() {
  const settings = useSettingsContext();

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Invite Participant for Survey"
          links={[
            // { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.root },
            {
              name: 'Survey',
              href: paths.dashboard.RiskAnalysis.RiskMitigation.papers.root,
            },
            {
              name: 'Invite Participant',
              href: paths.dashboard.RiskAnalysis.RiskMitigation.inviteParticipant.root,
            },
            { name: 'Add' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <SurveyInviteNewEditForm />
      </Container>
    </>
  );
}

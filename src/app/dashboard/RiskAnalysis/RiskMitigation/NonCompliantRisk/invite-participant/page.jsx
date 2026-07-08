'use client';
import { Button } from '@mui/material';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { SurveyInviteListView } from 'src/sections/survey-invite/view';

const page = () => {
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
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.RiskAnalysis.RiskMitigation.inviteParticipant.addInviteParticipant}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Invite Participant
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <SurveyInviteListView />
      </Container>
    </>
  );
};

export default page;

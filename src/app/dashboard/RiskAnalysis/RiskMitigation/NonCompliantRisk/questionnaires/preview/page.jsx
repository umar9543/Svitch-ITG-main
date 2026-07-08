'use client';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { Container } from '@mui/system';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import { QaPreviewCreateView } from 'src/sections/qa-preview/view';
import SurveyFormSubmission from 'src/components/SurveyFormSubmission';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Questions"
          links={[
            // { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.root },
            {
              name: 'Preview',
              href: paths.dashboard.RiskAnalysis.RiskMitigation.questionaries.root,
            },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        {/* <QaPreviewCreateView /> */}
        <SurveyFormSubmission />
      </Container>
    </>
  );
};

export default page;

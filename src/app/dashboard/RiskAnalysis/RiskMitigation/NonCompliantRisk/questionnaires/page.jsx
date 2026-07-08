'use client';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { Box, Container } from '@mui/system';
import { paths } from 'src/routes/paths';
import { Button } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { useEffect, useState } from 'react';
import QaQuestionariesProjectNewEditForm from 'src/sections/qa-questionaries/qa-questionaries-project-new-edit-form';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { Get } from 'src/utils/AxiosHelper';
import { getDecryptedUserData } from 'src/utils/getUser';
import { LoadingScreen } from 'src/components/loading-screen';
import { QaQuestionariesListView } from 'src/sections/qa-questionaries/view';

const page = () => {
  const settings = useSettingsContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [allQuestionnaires, setAllQuestionnaires] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const userData = getDecryptedUserData();

  const FetchQuestionnaire = async () => {
    const response = await Get(`GetProjectList?CustomerID=${userData[0]?.CustomerId}`);
    const decryptedData = decryptObjectKeys(response?.data?.ServiceRes);
    setAllQuestionnaires(decryptedData);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      Promise.all([FetchQuestionnaire()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const renderLoading = <LoadingScreen sx={{ height: { xs: 200, md: 300 } }} />;
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Questions"
          links={[
            // { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.root },
            { name: 'Questions', href: paths.dashboard.RiskAnalysis.RiskMitigation.questionaries.root },
          ]}
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={handleDialogOpen}
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New Questionnaires
              </Button>
              <Button
                component={RouterLink}
                href={`${paths?.dashboard.RiskAnalysis.RiskMitigation.questionaries.root}/add-questionnaires`}
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New Questions
              </Button>
            </Box>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        {isLoading ? renderLoading : <QaQuestionariesListView />}
      </Container>
      {dialogOpen && (
        <QaQuestionariesProjectNewEditForm
          uploadClose={handleDialogClose}
          uploadOpen={dialogOpen}
          allQuestionnaires={allQuestionnaires}
          FetchQuestionnaire={FetchQuestionnaire}
        />
      )}
    </>
  );
};

export default page;

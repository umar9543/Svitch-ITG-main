'use client';

import { Box, Button, Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import QaQuestionariesProjectNewEditForm from 'src/sections/qa-questionaries/qa-questionaries-project-new-edit-form';
import { useEffect, useState } from 'react';
import QaQuestionariesNewEditForm from 'src/sections/qa-questionaries/qa-questionaries-new-edit-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { Get } from 'src/utils/AxiosHelper';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { getDecryptedUserData } from 'src/utils/getUser';

const page = () => {
  const settings = useSettingsContext();

  const userData = getDecryptedUserData();
  const [allQuestionnaires, setAllQuestionnaires] = useState([]);
  const [isLoading, setLoading] = useState(false);


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

  const renderLoading = <LoadingScreen sx={{ height: { xs: 200, md: 300 } }} />;

  return (
    <>
      {isLoading ? (
        renderLoading
      ) : (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="Questions"
            links={[
              // { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.root },
              {
                name: 'Questions',
                href: paths.dashboard.RiskAnalysis.RiskMitigation.questionaries.root,
              },
              { name: 'Add Questions' },
            ]}
            sx={{ mb: { xs: 3, md: 5 } }}
            // action={
             
            // }
          />
          <QaQuestionariesNewEditForm
            allQuestionnaires={allQuestionnaires}
            setAllQuestionnaires={setAllQuestionnaires}
          />

         
        </Container>
      )}
    </>
  );
};

export default page;

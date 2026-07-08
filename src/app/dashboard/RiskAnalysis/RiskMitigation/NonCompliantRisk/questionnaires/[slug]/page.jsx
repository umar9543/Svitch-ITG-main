'use client';
import { Box, Button } from '@mui/material';
import { Container } from '@mui/system';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { decrypt } from 'src/api/encryption';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import QaQuestionariesNewEditForm from 'src/sections/qa-questionaries/qa-questionaries-new-edit-form';
import { Get } from 'src/utils/AxiosHelper';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { getDecryptedUserData } from 'src/utils/getUser';

const decryptRecursiveObjectKeys = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => decryptRecursiveObjectKeys(item));
  } else if (typeof data === 'object' && data !== null) {
    const decryptedItem = {};
    Object.keys(data).forEach((key) => {
      decryptedItem[key] = decryptRecursiveObjectKeys(data[key]);
    });
    return decryptedItem;
  } else {
    return decrypt(data);
  }
};

const page = () => {
  const { slug } = useParams();

  //   const [VenderLibraryID, CertificateID] = slug ? decodeURIComponent(slug).split('&') : [];
  const userData = getDecryptedUserData();
  const settings = useSettingsContext();
  const [allQuestionnaires, setAllQuestionnaires] = useState([]);
  const [questionData, setQuestionData] = useState([]);
  const [currentQuestions, setCurrentQuestions] = useState();
  const [tableData, setTableData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const FetchQuestionnaire = async () => {
    const response = await Get(`GetProjectList?CustomerID=${userData[0]?.CustomerId}`);
    const decryptedData = decryptObjectKeys(response?.data?.ServiceRes);
    setAllQuestionnaires(decryptedData);
  };
  const FetchQuestionData = async () => {
    const response = await Get(`GetQuestionnaireList?CustomerID=${userData[0]?.CustomerId}`);
    const decryptedData = decryptObjectKeys(response?.data?.ServiceRes);
    setQuestionData(decryptedData);
  };

  const GetQuestionnaireByID = async () => {
    const response = await Get(`GetQuestionnaireByID?QuestionnaireMstID=${slug}`);
    const decryptedData = decryptRecursiveObjectKeys(response?.data);
    setCurrentQuestions(decryptedData);
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      Promise.all([FetchQuestionnaire(), FetchQuestionData(), GetQuestionnaireByID()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const data = {
    QuestionnaireMstID: '7',
    Questionnaire: {
      ProjectID: '4',
      ProjectName: 'Child Labor',
    },
    Title: 'Recruitment and Employment Practices',
    GuideInstruction: 'Provide document in PDF version',
    Question:
      'Describe your recruitment process. How do you screen and select candidates to ensure compliance with child labor regulations?',
    AnswerBuilder: {
      ChoiceID: '4',
      ChoiceType: 'Single Choice (Radio Buttons)',
    },
    noOfChoices: {
      OptionID: '1',
      MaxChoices: '2',
    },
    Choices: [
      {
        ChoiceText: 'Yes',
        QuestionnaireDtlID: '1',
        FileTypeID: '1',
        FileType: 'PDF',
      },
      {
        ChoiceText: 'No',
        QuestionnaireDtlID: '2',
        FileTypeID: '4',
        FileType: 'N/A',
      },
    ],
  };

  const renderLoading = <LoadingScreen sx={{ height: { xs: 200, md: 300 } }} />;
  return (
    <>
      {isLoading ? (
        renderLoading
      ) : (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="Edit Question"
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.root },
              { name: 'Questions', href: paths.dashboard.RiskAnalysis.RiskMitigation.questionaries.root },
              //   {
              //     name: 'Edit Question',
              //     href: paths.dashboard.RiskAnalysis.RiskMitigation.questionaries.root,
              //   },
              { name: 'Edit ' },
            ]}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          />

          {!currentQuestions ? (
            <LoadingScreen
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '70vh',
              }}
            />
          ) : (
            <QaQuestionariesNewEditForm
              allQuestionnaires={allQuestionnaires}
              slug={slug}
              setAllQuestionnaires={setAllQuestionnaires}
              currentQuestions={currentQuestions}
              tableData={tableData}
            />
          )}
        </Container>
      )}
    </>
  );
};

export default page;

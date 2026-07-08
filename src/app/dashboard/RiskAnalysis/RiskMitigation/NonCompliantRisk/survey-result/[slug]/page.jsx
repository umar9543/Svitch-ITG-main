'use client';

import { Button } from '@mui/material';
import { Container } from '@mui/system';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useParams } from 'next/navigation';
import { settings } from 'nprogress';
import { useEffect, useState } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import Conrad from 'src/sections/qa-preview/Conrad';
import QaPreviewNewEditResultForm from 'src/sections/qa-preview/qa-preview-new-edit-result-form';
import { Get } from 'src/utils/AxiosHelper';
import { fDateTime } from 'src/utils/format-time';
import { decryptObjectKeys, decryptRecursiveObjectKeys } from 'src/utils/getDecryption';

const page = () => {
  const { slug } = useParams();
  const [allQuestions, setAllQuestions] = useState([]);
  // const [allQuestionsPDF, setAllQuestionsPDF] = useState([]);
  const [mstData, setMstData] = useState({});
  const [marksData, setMarksData] = useState([]);

  const [isLoading, setLoading] = useState(true);

  const GetSurveyResultByAssesmentID = async () => {
    const response = await Get(`GetSurveyResultByAssesmentID?SupplierAssessmentMstID=${slug}`);
    const decryptedData = decryptRecursiveObjectKeys(response?.data);

    if (response?.data?.ResponseCode === '-2') {
      setAllQuestions([]);
      return;
    }

    const mergedData = decryptedData?.map((section) => {
      const mergedQuestions = section?.Questions?.reduce((acc, question) => {
        const existingQuestion = acc.find(
          (q) => q.QuestionnaireMstID === question.QuestionnaireMstID
        );
        if (existingQuestion) {
          existingQuestion.Choices = [...existingQuestion.Choices, ...question.Choices];
        } else {
          acc.push({ ...question });
        }
        return acc;
      }, []);

      return { ...section, Questions: mergedQuestions };
    });

    setAllQuestions(mergedData);
  };

  const GetSupplierAssesmentInformation = async () => {
    const response = await Get(`GetSupplierAssesmentInformation?SupplierAssessmentMstID=${slug}`);
    const decryptedData = decryptObjectKeys(response?.data?.ServiceRes);
    if (response?.data?.ResponseCode === '-2') {
      setMstData({});
      return;
    }
    const data = {
      ...decryptedData[0],
      AssessmentDate: new Date(decryptedData[0]?.AssessmentDate),
    };
    setMstData(data);
  };

  const GetSupplierAssessmentData = async () => {
    try {
      const infoResponse = await Get(
        `GetSupplierAssesmentInformation?SupplierAssessmentMstID=${slug}`
      );
      const decryptedInfoData = decryptObjectKeys(infoResponse?.data?.ServiceRes);

      if (infoResponse?.data?.ResponseCode === '-2') {
        setMstData({});
      } else {
        setMstData({
          ...decryptedInfoData[0],
          AssessmentDate: new Date(decryptedInfoData[0]?.AssessmentDate),
        });
      }

      const marksResponse = await Get(
        `GetSupplierAssessmentMarksList?SupplierAssessmentMstID=${slug}`
      );
      const decryptedMarksData = decryptObjectKeys(marksResponse?.data?.ServiceRes);
      const marksDataa = marksResponse?.data?.ResponseCode === '-2' ? [] : decryptedMarksData;

      const surveyResponse = await Get(
        `GetSurveyResultByAssesmentID?SupplierAssessmentMstID=${slug}`
      );
      const decryptedSurveyData = decryptRecursiveObjectKeys(surveyResponse?.data);

      // Step 1: Add Marks to each question
      const allQuestionsWithMarks =
        surveyResponse?.data?.ResponseCode === '-2'
          ? []
          : decryptedSurveyData.map((section) => ({
              ...section,
              Questions: section?.Questions?.map((question) => {
                const markData = marksDataa?.find(
                  (mark) => mark.QuestionnaireMstID === question.QuestionnaireMstID
                );
                return { ...question, Marks: markData?.Marks || 0 };
              }),
            }));

      // Step 2: Merge Choices for questions with the same QuestionnaireMstID
      const mergedData = allQuestionsWithMarks?.map((section) => {
        const mergedQuestions = section?.Questions?.reduce((acc, question) => {
          const existingQuestion = acc.find(
            (q) => q.QuestionnaireMstID === question.QuestionnaireMstID
          );
          if (existingQuestion) {
            // Merge Choices
            existingQuestion.Choices = [...existingQuestion.Choices, ...question.Choices];
          } else {
            acc.push({ ...question });
          }
          return acc;
        }, []);

        return { ...section, Questions: mergedQuestions };
      });

      // Step 3: Update state
      setMarksData(marksDataa);
      setAllQuestions(mergedData);
    } catch (error) {
      console.error('Error fetching supplier assessment data:', error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      await Promise.all([
        GetSurveyResultByAssesmentID(),
        GetSupplierAssesmentInformation(),
        GetSupplierAssessmentData(),
      ]);
      setLoading(false);
    };
    fetch();
  }, []);

  const renderLoading = <LoadingScreen sx={{ height: { xs: 200, md: 300 } }} />;
  const exportDateTime = fDateTime(new Date());
  const surveyName = mstData?.SurveyNo;
  const supplierName = mstData?.CompanyName;

  const fileNamee = `${surveyName}_${supplierName}_${exportDateTime}.pdf`;
  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{ bgcolor: '#fffdfa', p: 2, borderRadius: 2 }}
    >
      <CustomBreadcrumbs
        heading="Answer Sheet"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Survey',
            href: paths.dashboard.RiskAnalysis.RiskMitigation.papers.root,
          },
          {
            name: 'Survey Initiation',
            href: paths.dashboard.RiskAnalysis.RiskMitigation.inviteParticipant.root,
          },
          { name: 'Answer Sheet' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        action={
          !isLoading &&
          allQuestions.length > 0 && (
            <PDFDownloadLink
              document={
                <Conrad allQuestions={allQuestions} mstData={mstData} marksData={marksData} exportDateTime />
              }
              fileName={fileNamee}
              style={{ textDecoration: 'none' }}
            >
              {({ loading }) => (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  startIcon={<Iconify icon="material-symbols:download" />}
                >
                  {loading ? 'Preparing PDF...' : 'Download PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          )
        }
      />
      {isLoading ? (
        renderLoading
      ) : (
        <QaPreviewNewEditResultForm
          allQuestions={allQuestions}
          mstData={mstData}
          marksData={marksData}
        />
      )}
    </Container>
  );
};

export default page;

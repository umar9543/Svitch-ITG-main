'use client';

import { Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Get } from 'src/utils/AxiosHelper';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import QaPapersEditForm from 'src/sections/qa-papers/qa-papers-edit-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { decrypt } from 'src/api/encryption';

const mergeQuestionsByMstID = (data) => {
  return data.map((section) => {
    const mergedQuestions = [];

    section.Questions.forEach((question) => {
      const existingQuestion = mergedQuestions.find(
        (q) => q.QuestionnaireMstID === question.QuestionnaireMstID
      );

      if (existingQuestion) {
        existingQuestion.Choices = [...existingQuestion.Choices, ...question.Choices];
      } else {
        mergedQuestions.push({ ...question });
      }
    });

    return { ...section, Questions: mergedQuestions };
  });
};

const page = () => {
  const { slug } = useParams();

  const settings = useSettingsContext();
  const [surveyData, setSurveyData] = useState();
  const [questionnaireMstIDs, setQuestionnaireMstIDs] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const GetSurveyDetails = async () => {
    try {
      const res = await Get(`GetSurveyDetails?SurveyNo=${slug}`);
      const raw = res.data.ServiceRes ?? [];

      const decryptedData = raw.map((item) => {
        const { PerformanceAreas, ...rest } = item;
        const decryptedItem = decryptObjectKeys([rest])[0];
        decryptedItem.PerformanceAreas = Array.isArray(PerformanceAreas)
          ? decryptObjectKeys(PerformanceAreas)
          : [];
        return decryptedItem;
      });

      const transformedData = Object.values(
        decryptedData.reduce((acc, item) => {
          const { SurveyNo, QuestionnaireMstID, SurveyID, Tittle, Guide, Question, PerformanceAreas, ...rest } = item;

          if (!acc[SurveyNo]) {
            acc[SurveyNo] = { ...rest, SurveyNo, QuestionnaireMstID: [], Questions: [], PerformanceAreas: PerformanceAreas || [] };
          }

          acc[SurveyNo].QuestionnaireMstID.push(QuestionnaireMstID);
          acc[SurveyNo].Questions.push({ Title: Tittle, Guide, Question });

          return acc;
        }, {})
      );
      setSurveyData(transformedData[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const GetQuestionsBySurveyNo = async () => {
    try {
      const res = await Get(`GetQuestionsBySurvey?SurveyNo=${slug}`);
      const decryptedData = decryptRecursiveObjectKeys(res.data);
      const mergedData = mergeQuestionsByMstID(decryptedData);
      const allQuestionnaireMstIDs = mergedData?.flatMap((section) =>
        section?.Questions.map((q) => q.QuestionnaireMstID)
      );
      setQuestionnaireMstIDs(allQuestionnaireMstIDs); // create a function to extract QuestionnaireMstIDs from mergedData and set it to state
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all[(GetSurveyDetails(), GetQuestionsBySurveyNo())];
      setLoading(false);
    };

    fetchData();
  }, []);

  return loading ? (
    <LoadingScreen sx={{ height: 300 }} />
  ) : (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Survey"
          links={[
            // { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.root },
            {
              name: 'Survey',
              href: paths.dashboard.RiskAnalysis.RiskMitigation.papers.root,
            },
            { name: 'Create Survey' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <QaPapersEditForm
          surveyData={surveyData}
          selectedQuestionnaireMstIDs={questionnaireMstIDs}
        />
      </Container>
    </>
  );
};

export default page;

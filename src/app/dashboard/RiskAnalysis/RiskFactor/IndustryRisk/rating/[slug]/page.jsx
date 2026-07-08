'use client';
import { Box, Button } from '@mui/material';
import { Container } from '@mui/system';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import IndustryRatingNewEditForm from 'src/sections/IndustryRating/IndustryRating-new-edit-form';
import { Get } from 'src/utils/AxiosHelper';
import { decryptObjectKeys } from 'src/utils/getDecryption';

const page = () => {
  const { slug } = useParams();
  const settings = useSettingsContext();
  const [currentIndustryRating, setCurrentIndustryRating] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const GetIndustryByID = async () => {
    try {
      const res = await Get(
        `GetRiskAnalysisIndustryRateingByID?RiskAnalysisIndustryRateingMstID=${slug}`
      );
      const decryptedData = decryptObjectKeys(res.data.ServiceRes);
      setCurrentIndustryRating(decryptedData);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await GetIndustryByID();
      setLoading(false);
    };

    fetchData();
  }, []);
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Industry Risk By PA"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.root },
            // { name: 'Industry Risk', href: paths.dashboard.RiskAnalysis.RiskFactor.IndustryRisk.root },
            {
              name: 'Industry Risk By PA',
              href: paths.dashboard.RiskAnalysis.RiskFactor.IndustryRisk.rating.root,
            },
            { name: 'Edit ' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        {isLoading ? (
          <LoadingScreen
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '70vh',
            }}
          />
        ) : (
          <IndustryRatingNewEditForm currentIndustryRating={currentIndustryRating} />
        )}
      </Container>
    </>
  );
};

export default page;

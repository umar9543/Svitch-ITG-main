'use client';
import { Box, Button } from '@mui/material';
import { Container } from '@mui/system';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { LoadingScreen } from 'src/components/loading-screen';
import { paths } from 'src/routes/paths';
import CountryRatingNewEditForm from 'src/sections/CountryRating/CountryRating-new-edit-form';
import { Get } from 'src/utils/AxiosHelper';
import { decryptObjectKeys } from 'src/utils/getDecryption';

const page = () => {
  const { slug } = useParams();

  const settings = useSettingsContext();

  const [currentCountryRating, setCurrentCountryRating] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const GetCountryByID = async () => {
    try {
      const res = await Get(
        `GetRiskAnalysisCountryRateingByID?RiskAnalysisCountryRateingMstID=${slug}`
      );
      const decryptedData = decryptObjectKeys(res.data.ServiceRes);
      setCurrentCountryRating(decryptedData);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await GetCountryByID();
      setLoading(false);
    };

    fetchData();
  }, []);
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Country Risk By PA"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.root },
            // { name: 'Country Risk', href: paths.dashboard.RiskAnalysis.RiskFactor.CountryRisk.root },
            {
              name: 'Country Risk By PA',
              href: paths.dashboard.RiskAnalysis.RiskFactor.CountryRisk.rating.root,
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
          <CountryRatingNewEditForm currentCountryRating={currentCountryRating} />
        )}
      </Container>
    </>
  );
};

export default page;

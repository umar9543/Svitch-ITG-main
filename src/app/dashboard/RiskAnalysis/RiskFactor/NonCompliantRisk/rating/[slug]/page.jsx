'use client';
import { Box, Button } from '@mui/material';
import { Container } from '@mui/system';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import NonCompliantRatingNewEditForm from 'src/sections/NonCompliantRating/NonCompliantRating-new-edit-form';
import { Get } from 'src/utils/AxiosHelper';
import { decryptObjectKeys } from 'src/utils/getDecryption';

const page = () => {
  const { slug } = useParams();

  const [VenderLibraryID, CertificateID] = slug ? decodeURIComponent(slug).split('&') : [];

  const settings = useSettingsContext();
  const [currentNonCompliantRating, setCurrentNonCompliantRating] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const GetNonCompliantByID = async () => {
    try {
      const res = await Get(
        `GetNonComplaintRiskAnalysisByID?VenderLibraryID=${VenderLibraryID}&CertificateID=${CertificateID}`
      );
      const decryptedData = decryptObjectKeys(res.data.ServiceRes);
      setCurrentNonCompliantRating(decryptedData);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await GetNonCompliantByID();
      setLoading(false);
    };

    fetchData();
  }, []);
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Non-Compliant Risk By PA"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.root },
            // { name: 'NonCompliant Risk', href: paths.dashboard.RiskAnalysis.RiskFactor.NonCompliantRisk.root },
            {
              name: 'Non-Compliant Risk By PA',
              href: paths.dashboard.RiskAnalysis.RiskFactor.NonCompliantRisk.rating.root,
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
          <NonCompliantRatingNewEditForm currentNonCompliantRating={currentNonCompliantRating} />
        )}
      </Container>
    </>
  );
};

export default page;

'use client';
import { Button } from '@mui/material';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { getDecryptedUserData } from 'src/utils/getUser';
import { Get } from 'src/utils/AxiosHelper';
import { LoadingScreen } from 'src/components/loading-screen';
import LawsMatrixNewEditForm from 'src/sections/LawsMatrix/LawsMatrix-new-edit-form';

const page = () => {
  const settings = useSettingsContext();
  const { id } = useParams();

  const [currentLawsMatrix, setCurrentLawsMatrix] = useState();

  const userID = getDecryptedUserData() ? getDecryptedUserData()[0].UserID : 86;

  const GetLawsMatrixByID = async () => {
    try {
      // setisLoading(true);
      const res = await Get(`GetLawDatabaseByID?LawDatabaseID=${id}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCurrentLawsMatrix(decryptedData[0]);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting lawsmatrix by id', res.data.ServiceRes);
      }
      // setisLoading(false);
    } catch (error) {
      console.log('error getting lawsmatrix by ID', error);
    }
  };
  useEffect(() => {
    GetLawsMatrixByID();
  }, [userID]);
  console.log('currentLawsMatrix', currentLawsMatrix);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Risk Matrix "
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.Riskframework.LawsMatrix.root },
            { name: 'Risk Matrix', href: paths.dashboard.RiskAnalysis.Riskframework.LawsMatrix.root },
            { name: 'Edit' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        {!currentLawsMatrix ? (
          <LoadingScreen sx={{ height: '500px' }} />
        ) : (
          <LawsMatrixNewEditForm currentLawsMatrix={currentLawsMatrix} />
        )}
      </Container>
    </>
  );
};

export default page;

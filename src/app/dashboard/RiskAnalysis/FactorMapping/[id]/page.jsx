'use client';
import { Button } from '@mui/material';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import FactorMappingNewEditForm from 'src/sections/FactorMapping/FactorMapping-new-edit-form';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { getDecryptedUserData } from 'src/utils/getUser';
import { Get } from 'src/utils/AxiosHelper';
import { LoadingScreen } from 'src/components/loading-screen';

const page = () => {
  const settings = useSettingsContext();
  const { id } = useParams();

  const [currentFactorMapping, setCurrentFactorMapping] = useState();

  const userID = getDecryptedUserData() ? getDecryptedUserData()[0].UserID : 86;

  const GetFactorMappingByID = async () => {
    try {
      // setisLoading(true);
      const res = await Get(`GetLawDatabaseByID?LawDatabaseID=${id}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCurrentFactorMapping(decryptedData[0]);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting FactorMapping by id', res.data.ServiceRes);
      }
      // setisLoading(false);
    } catch (error) {
      console.log('error getting FactorMapping by ID', error);
    }
  };
  useEffect(() => {
    GetFactorMappingByID();
  }, [userID]);
  console.log('currentFactorMapping', currentFactorMapping);
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="FactorMapping "
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.FactorMapping.root },
            { name: 'FactorMapping', href: paths.dashboard.RiskAnalysis.FactorMapping.root },
            { name: 'Edit' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        {!currentFactorMapping ? (
          <LoadingScreen sx={{ height: '500px' }} />
        ) : (
          <FactorMappingNewEditForm currentFactorMapping={currentFactorMapping} />
        )}
      </Container>
    </>
  );
};

export default page;

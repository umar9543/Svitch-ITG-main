'use client';

import { Box, Button, Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import PreOnboardingNewEditForm from 'src/sections/PreOnboarding/PreOnboarding-new-edit-form';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { Get } from 'src/utils/AxiosHelper';
import { getDecryptedUserData } from 'src/utils/getUser';
import { LoadingScreen } from 'src/components/loading-screen';

const page = () => {
  const settings = useSettingsContext();

  const { slug } = useParams();
  console.log(slug);

  const [currentSupplier, setCurrentSupplier] = useState();
  const [isLoading, setisLoading] = useState(false);
  const userID = getDecryptedUserData()[0].UserID;

  const GetSupplierByID = async () => {
    // if (!decVID) {
    //   console.error('Decrypted VID is undefined, skipping API call.');
    //   return;
    // }
    try {
      const res = await Get(`GetSupplierDataByID?UserID=${userID}&VenderLibraryID=${slug}`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        console.log('Decrypted Data:', decryptedData);
        setCurrentSupplier(decryptedData[0]);
      } else {
        console.error('Error in getting supplier data by ID', res.data.ServiceRes);
      }
    } catch (error) {
      console.error('Error getting supplier by ID', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setisLoading(true);
        await Promise.all([
          GetSupplierByID(),
          //   getCountries(),
          //   getSupplierContact(),
          //   getVendorSupply(),
          //   GetSupplierCertificateByID(),
        ]);
        setisLoading(false);
      } catch (error) {
        console.error('error loading all the required api', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Pre-Onboard Supplier"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Onboarding', href: paths.dashboard.OnBoarding.root },
            { name: 'Pre-Onboard', href: paths.dashboard.OnBoarding.preOnboarding.root },
            { name: 'Edit' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        {isLoading ? (
          <LoadingScreen sx={{ mt: 5 }} />
        ) : (
          <PreOnboardingNewEditForm currentPreOnboarding={currentSupplier} />
        )}
      </Container>
    </>
  );
};

export default page;

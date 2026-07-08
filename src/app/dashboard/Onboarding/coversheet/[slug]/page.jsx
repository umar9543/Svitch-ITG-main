'use client';
import { Box, Container } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { decrypt } from 'src/api/encryption';
import { useParams } from 'next/navigation';
import OnBoardingCoversheetNewEditForm from 'src/sections/OnBoardingCoversheet/OnBoardingCoversheet-new-edit-form';
import { useEffect, useState } from 'react';
import { Get } from 'src/utils/AxiosHelper';
import { LoadingScreen } from 'src/components/loading-screen';
import { getDecryptedUserData } from 'src/utils/getUser';
// import SupplierForm from 'src/components/SupplierForm';

const page = () => {
  const settings = useSettingsContext();
  const { slug } = useParams();
  const userID = getDecryptedUserData() ? getDecryptedUserData()[0].UserID : 86;

  const [currentSupply, setCurrentSupply] = useState({});
  const [currentSupplierContact, setCurrentSupplierContact] = useState({});
  const [vendorSupply, setVendorSupply] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [currentCertificate, setCurrentCertificate] = useState([]);
  const [currentScores, setCurrentScores] = useState([]);
  const [currentCoverSheet, setCurrentCoverSheet] = useState([]);

  const decryptObjectKeys = (data) => {
    const decryptedData = data.map((item) => {
      const decryptedItem = {};
      Object.keys(item).forEach((key) => {
        decryptedItem[key] = decrypt(item[key]);
      });
      return decryptedItem;
    });
    return decryptedData;
  };

  const GetSupplierByID = async () => {
    try {
      // setisLoading(true);
      const res = await Get(`GetSupplierDataByID?UserID=${userID}&VenderLibraryID=${slug}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCurrentSupply(decryptedData[0]);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting supplierdata by id', res.data.ServiceRes);
      }
      // setisLoading(false);
    } catch (error) {
      console.log('error getting supplier by ID', error);
    }
  };

  const getCountries = async () => {
    try {
      const res = await Get(`GetCountry?UserID=${userID}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setAllCountries(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting country by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting country by ID', error);
    }
  };

  const GetSupplierCertificateByID = async () => {
    try {
      const res = await Get(`GetCertificateByID?VenderID=${slug}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCurrentCertificate(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting certificates by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting certificates by ID', error);
    }
  };

  const getSupplierContact = async () => {
    try {
      const res = await Get(`GetVenderPersonnelByID?UserID=${userID}&VenderLibraryID=${slug}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCurrentSupplierContact(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting supplierdata by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting supplier by ID', error);
    }
  };

  const getVendorSupply = async () => {
    try {
      const res = await Get(`GetVenderSupplyChainByID?UserID=${userID}&VenderLibraryID=${slug}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setVendorSupply(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting supplierdata by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting supplier by ID', error);
    }
  };

  const GetScoreCard = async () => {
    try {
      const res = await Get(`GetScoreCard?VenderLibraryID=${slug}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCurrentScores(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting scores by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting scores by ID', error);
    }
  };

  const GetCoverSheetByID = async () => {
    try {
      const res = await Get(`GetCoverSheetByID?VenderID=${slug}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCurrentCoverSheet(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting scores by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting scores by ID', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          GetSupplierByID(),
          getCountries(),
          getSupplierContact(),
          getVendorSupply(),
          GetSupplierCertificateByID(),
          GetScoreCard(),
          GetCoverSheetByID(),
        ]);
        setisLoading(false);
      } catch (error) {
        console.error('error loading all the required api', error);
      }
    };

    fetchData();
  }, []);

  const lastItem = currentCoverSheet[currentCoverSheet?.length - 1];

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Supplier Onboarding Coversheet"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Onboarding ', href: paths.dashboard.OnBoarding.root },
            { name: 'Coversheet', href: paths.dashboard.OnBoarding.coversheet.root },
            { name: 'Supplier Onboarding Coversheet' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        {!isLoading ? (
          <OnBoardingCoversheetNewEditForm
            currentSupplier={currentSupply}
            currentSupplierContact={currentSupplierContact}
            vendorSupply={vendorSupply}
            allCountries={allCountries}
            setisLoading={setisLoading}
            currentCertificate={currentCertificate}
            currentScores={currentScores}
            currentCoverSheet={lastItem}
          />
        ) : (
          <LoadingScreen
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '70vh',
            }}
          />
        )}
      </Container>
    </>
  );
};

export default page;

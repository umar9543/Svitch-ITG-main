'use client';
import { Box, Container } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { decrypt } from 'src/api/encryption';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Get } from 'src/utils/AxiosHelper';
import { LoadingScreen } from 'src/components/loading-screen';
import { getDecryptedUserData } from 'src/utils/getUser';
import SupplierOnboardForm from 'src/components/SupplierOnboardForm';
import { decryptLink } from 'src/utils/LinkEncryption';

const page = () => {
  const settings = useSettingsContext();
  const userID = getDecryptedUserData() ? getDecryptedUserData()[0].UserID : 86;
  const { slug } = useParams();

  // Decode the slug
  const decodedSlug = decodeURIComponent(slug);

  // Extract VID and OnBoardingDTLID using URLSearchParams
  const urlParams = new URLSearchParams(decodedSlug);
  const VID = urlParams.get('VID');
  const OnBoardingDTLID = urlParams.get('OnBoardingDTLID');

  // Initialize state for decrypted values
  const [decVID, setDecVID] = useState(null);
  const [decOnBoardingDTLID, setDecOnBoardingDTLID] = useState(null);

  // Log the encrypted values
  // console.log('Encrypted VID:', VID);
  // console.log('Encrypted OnBoardingDTLID:', OnBoardingDTLID);

  // Decrypt the values
  // Decrypt the values
  useEffect(() => {
    if (VID && OnBoardingDTLID) {
      try {
        const decryptedVID = decryptLink(VID);
        const decryptedOnBoardingDTLID = decryptLink(OnBoardingDTLID);

        setDecVID(decryptedVID);
        setDecOnBoardingDTLID(decryptedOnBoardingDTLID);
      } catch (error) {
        console.error('Decryption Error:', error.message);
      }
    } else {
      console.error('VID or OnBoardingDTLID is missing from the URL');
    }
  }, [VID, OnBoardingDTLID]);

  const [currentSupply, setCurrentSupply] = useState();
  const [currentSupplierContact, setCurrentSupplierContact] = useState([]);
  const [vendorSupply, setVendorSupply] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [currentCertificate, setCurrentCertificate] = useState([]);

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
    if (!decVID) {
      console.error('Decrypted VID is undefined, skipping API call.');
      return;
    }
    try {
      const res = await Get(`GetSupplierDataByID?UserID=${userID}&VenderLibraryID=${decVID}`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCurrentSupply(decryptedData[0]);
      } else {
        console.error('Error in getting supplier data by ID', res.data.ServiceRes);
      }
    } catch (error) {
      console.error('Error getting supplier by ID', error);
    }
  };

  const GetSupplierCertificateByID = async () => {
    try {
      const res = await Get(`GetCertificateByID?VenderID=${decVID}`);
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

  const getCountries = async () => {
    try {
      const res = await Get(`GetCountry?UserID=${userID}`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setAllCountries(decryptedData);
      } else {
        console.error('Error in getting country by ID', res.data.ServiceRes);
      }
    } catch (error) {
      console.error('Error getting country by ID', error);
    }
  };

  const getSupplierContact = async () => {
    if (!decVID) {
      console.error('Decrypted VID is undefined, skipping API call.');
      return;
    }
    try {
      const res = await Get(`GetVenderPersonnelByID?UserID=${userID}&VenderLibraryID=${decVID}`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCurrentSupplierContact(decryptedData);
      } else {
        console.error('Error in getting supplier contact by ID', res.data.ServiceRes);
      }
    } catch (error) {
      console.error('Error getting supplier contact by ID', error);
    }
  };

  const getVendorSupply = async () => {
    if (!decVID) {
      console.error('Decrypted VID is undefined, skipping API call.');
      return;
    }
    try {
      const res = await Get(`GetVenderSupplyChainByID?UserID=${userID}&VenderLibraryID=${decVID}`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setVendorSupply(decryptedData);
      } else {
        console.error('Error in getting vendor supply chain by ID', res.data.ServiceRes);
      }
    } catch (error) {
      console.error('Error getting vendor supply chain by ID', error);
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
        ]);
        setisLoading(false);
      } catch (error) {
        console.error('Error loading all the required data', error);
      }
    };

    // Only run fetchData if decVID is available
    if (decVID) {
      fetchData();
    }
  }, [decVID]);

  return (
    <>
      <Container maxWidth='lg'>
        <CustomBreadcrumbs
          heading="Supplier Onboarding Details"
          links={[
            { name: 'Onboard', href: paths.dashboard.root },
            { name: 'Supplier Onboarding Details', href: paths.dashboard.supplier.root },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        {!isLoading ? (
          <SupplierOnboardForm
            currentSupplier={currentSupply}
            currentSupplierContact={currentSupplierContact}
            vendorSupply={vendorSupply}
            allCountries={allCountries}
            setisLoading={setisLoading}
            OnBoardingDTLID={decOnBoardingDTLID}
            currentCertificate={currentCertificate}
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

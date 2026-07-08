'use client';

import { Container } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { decrypt } from 'src/api/encryption';
import { useParams } from 'next/navigation';
import SupplierNewEditForm from 'src/sections/supplier/supplier-new-edit-form';
import { useEffect, useState } from 'react';
import { Get } from 'src/utils/AxiosHelper';
import { LoadingScreen } from 'src/components/loading-screen';
import { getDecryptedUserData } from 'src/utils/getUser';

const page = () => {
  const settings = useSettingsContext();
  const { slug } = useParams();
  const userID = getDecryptedUserData() ? getDecryptedUserData()[0].UserID : 86;

  const [currentSupply, setCurrentSupply] = useState({});
  const [currentSupplierContact, setCurrentSupplierContact] = useState({});
  const [vendorSupply, setVendorSupply] = useState([]);
  const [currentCertificate, setCurrentCertificate] = useState([]);
  const [surveyDetail, setSurveyDetail] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [isLoading, setisLoading] = useState(true);

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
      const res = await Get(`GetSupplierDataByID?UserID=${userID}&VenderLibraryID=${slug}`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCurrentSupply(decryptedData[0]);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting supplierdata by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting supplier by ID', error);
    }
  };

  const GetSupplierCertificateByID = async () => {
    try {
      const res = await Get(`GetCertificateByID?VenderID=${slug}`);
      if (res.data.ResponseCode === '100') {
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
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting country by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting country by ID', error);
    }
  };

  const getSupplierContact = async () => {
    try {
      const res = await Get(`GetVenderPersonnelByID?UserID=${userID}&VenderLibraryID=${slug}`);
      if (res.data.ResponseCode === '100') {
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
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setVendorSupply(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting supplierdata by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting supplier by ID', error);
    }
  };

  const GetSeverDetailBySupplierID = async () => {
    try {
      const res = await Get(`GetSeverDetailBySupplierID?SupplierID=${slug}`);
      if (res.data.ResponseCode === '100') {
        const data = res.data.Data;
        const decryptedData = Array.isArray(data) && data.length > 0 ? decryptObjectKeys(data) : [];
        setSurveyDetail(decryptedData);
      }
    } catch (error) {
      console.log('error getting survey detail by supplier ID', error);
      setSurveyDetail([]);
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
          GetSeverDetailBySupplierID(),
        ]);
        setisLoading(false);
      } catch (error) {
        console.error('error loading all the required api', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Supplier Summary"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Supplier Database', href: paths.dashboard.supplier.root },
          { name: 'Supplier Summary' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {!isLoading ? (
        <SupplierNewEditForm
          currentSupplier={currentSupply}
          currentSupplierContact={currentSupplierContact}
          vendorSupply={vendorSupply}
          allCountries={allCountries}
          currentCertificate={currentCertificate}
          surveyDetail={surveyDetail}
          setisLoading={setisLoading}
          viewMode
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
  );
};

export default page;

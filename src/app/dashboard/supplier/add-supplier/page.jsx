'use client';
import { Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import SupplierNewEditForm from 'src/sections/supplier/supplier-new-edit-form';
import { useEffect, useState } from 'react';
import { decrypt } from 'src/api/encryption';
import { Get } from 'src/utils/AxiosHelper';
import { LoadingScreen } from 'src/components/loading-screen';
import { getDecryptedUserData } from 'src/utils/getUser';

const page = () => {
  const settings = useSettingsContext();

  const [allCountries, setAllCountries] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const userID = getDecryptedUserData() ? getDecryptedUserData()[0].UserID : 86;

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([getCountries()]);
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
          heading="Add Supplier"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Supplier Database', href: paths.dashboard.supplier.root },
            { name: 'Add Supplier' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        {!isLoading ? (
          <SupplierNewEditForm allCountries={allCountries} />
        ) : (
          <LoadingScreen
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '70vh',
            }}
          />
        )}{' '}
      </Container>
    </>
  );
};

export default page;

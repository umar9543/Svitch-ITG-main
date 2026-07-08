'use client';
import { Box, Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useParams } from 'next/navigation';
import UserNewEditForm from 'src/sections/user/user-new-edit-form';
import { useEffect, useState } from 'react';
import { Get } from 'src/utils/AxiosHelper';
import { decrypt } from 'src/api/encryption';
import { LoadingScreen } from 'src/components/loading-screen';
import { paths } from 'src/routes/paths';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { getDecryptedUserData } from 'src/utils/getUser';
// import CustomerForm from 'src/components/CustomerForm';

const page = () => {
  const { slug } = useParams();
  const settings = useSettingsContext();

  const [currentUser, setCurrentUser] = useState({});
  const [currentUserContact, setCurrentUserContact] = useState();
  const [customerSupply, setCustomerSupply] = useState([]);
  const [customerMembership, setCustomerMembership] = useState([]);
  const [customerAttachment, setCustomerAttachment] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  const userID = getDecryptedUserData() ? getDecryptedUserData()[0].UserID : 86;

  const GetCustomerByID = async () => {
    try {
      // setisLoading(true);
      const res = await Get(`GetCustomerDataByID?UserID=${userID}&CustomerID=${slug}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCurrentUser(decryptedData[0]);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting customerdata by id', res.data.ServiceRes);
      }
      // setisLoading(false);
    } catch (error) {
      console.log('error getting customer by ID', error);
    }
  };
  const GetCustomerContactByID = async () => {
    try {
      setisLoading(true);
      const res = await Get(`GetCustomerDetailDataByID?UserID=${userID}&CustomerID=${slug}`);
      if (res.data.ResponseCode === '100') {
        // console.log('res.data.ServiceRes', res.data.ServiceRes);
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCurrentUserContact(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting customer contact by id', res.data.ServiceRes);
      }
      setisLoading(false);
    } catch (error) {
      console.log('error getting customer contact by ID', error);
    }
  };

  const GetCustomerSupply = async () => {
    try {
      const res = await Get(`GetCustomerSupplyChainDataByID?UserID=${userID}&CustomerID=${slug}`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCustomerSupply(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting country code by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting country code by ID', error);
    }
  };

  const GetCustomermembership = async () => {
    try {
      const res = await Get(`GetCustomerMemberShipDetailData?UserID=${userID}&CustomerID=${slug}`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCustomerMembership(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting country code by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting country code by ID', error);
    }
  };

  const GetCustomerAttachment = async () => {
    try {
      const res = await Get(`GetCustomerRefAndAttachment?UserID=${userID}&CustomerID=${slug}`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setCustomerAttachment(decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting country code by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting country code by ID', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          GetCustomerByID(),
          GetCustomerContactByID(),
          GetCustomerSupply(),
          GetCustomermembership(),
          GetCustomerAttachment(),
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
          heading="Edit Customer"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Customer Database',
              href: paths.dashboard.customerDatabase.root,
            },
            { name: 'Edit Customer' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        {!isLoading ? (
          <UserNewEditForm
            currentUser={currentUser}
            slug={slug}
            currentUserContact={currentUserContact}
            customerSupply={customerSupply}
            customerMembership={customerMembership}
            customerAttachment={customerAttachment}
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

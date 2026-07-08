'use client';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { decrypt } from 'src/api/encryption';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Get } from 'src/utils/AxiosHelper';
import { getDecryptedUserData } from 'src/utils/getUser';
import { decryptLink, encryptLink } from 'src/utils/LinkEncryption';
import UpdateCertificate from 'src/components/UpdateCertificateForm';
import { Stack } from '@mui/system';
import { enqueueSnackbar } from 'notistack';
import { MuiOtpInput } from 'mui-one-time-password-input';

const page = () => {
  const settings = useSettingsContext();
  const userID = getDecryptedUserData() ? getDecryptedUserData()[0].UserID : 86;
  const { slug } = useParams();

  // Decode the slug
  const decodedSlug = decodeURIComponent(slug);

  // Extract VID  using URLSearchParams
  const urlParams = new URLSearchParams(decodedSlug);
  const VID = urlParams.get('VID');
  const URLOTP = urlParams.get('O12P');
  const EXPDate = urlParams.get('Xkp');

  // Initialize state for decrypted values
  const [decVID, setDecVID] = useState(null);
  const [decOTP, setDecOTP] = useState(null);
  const [decEXPDate, setDecEXPDate] = useState(null);
  const [otp, setOtp] = useState('');
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(true); // Initially open the dialog

  // Decrypt the values
  useEffect(() => {
    if (VID && URLOTP && EXPDate) {
      try {
        const decryptedVID = decryptLink(VID);
        const decryptedOTP = decryptLink(URLOTP);
        const decryptedEXPDate = decryptLink(EXPDate);
        console.log('decryptedExpDate', decryptedEXPDate);

        setDecVID(decryptedVID);
        setDecOTP(decryptedOTP);
        setDecEXPDate(decryptedEXPDate);
      } catch (error) {
        console.error('Decryption Error');
      }
    } else {
      console.error('Something went wrong');
    }
  }, [VID, URLOTP, EXPDate]);

  const [isLoading, setisLoading] = useState(true);
  const [currentSupplier, setCurrentSupplier] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
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
        setCurrentSupplier(decryptedData[0]);
      } else {
        console.error('Error in getting supplier data by ID', res.data.ServiceRes);
      }
    } catch (error) {
      console.error('Error getting supplier by ID', error);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([GetSupplierByID(), GetSupplierCertificateByID(), getCountries()]);
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

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const handleVerifyOtp = () => {
    if (otp === decOTP) {
      const currentDate = new Date();
      const expirationDate = new Date(decEXPDate);

      if (currentDate <= expirationDate) {
        setIsOtpValid(true);
        setDialogOpen(false);
      } else {
        enqueueSnackbar('The OTP has expired.', { variant: 'error' });
      }
    } else {
      enqueueSnackbar('Invalid OTP. Please try again.', { variant: 'error' });
    }
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {/* OTP Dialog */}
        <Dialog open={dialogOpen} disableBackdropClick disableEscapeKeyDown>
          <DialogContent>
            <Stack spacing={2} mt={3}>
              <Typography variant="h6">Enter OTP</Typography>

              <MuiOtpInput
                value={otp}
                onChange={handleOtpChange}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleVerifyOtp();
                  }
                }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleVerifyOtp} variant="contained" color="primary">
              Verify
            </Button>
          </DialogActions>
        </Dialog>

        {isOtpValid && (
          <UpdateCertificate
            // setisLoading={setisLoading}
            VID={decVID}
            currentSupplier={currentSupplier}
            allCountries={allCountries}
            currentCertificate={currentCertificate}
          />
        )}
      </Container>
    </>
  );
};

export default page;

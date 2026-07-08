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
import SurveyFormSubmission from 'src/components/SurveyFormSubmission';

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
  const SurveyNo = urlParams.get('svNo');
  const EXPDate = urlParams.get('Xkp');
  const InitationID = urlParams.get('invd');

  // Initialize state for decrypted values
  const [decVID, setDecVID] = useState(null);
  const [decOTP, setDecOTP] = useState(null);
  const [decEXPDate, setDecEXPDate] = useState(null);
  const [decSurveyNo, setDecSurveyNo] = useState(null);
  const [decryptedInitationID, setDecryptedInitationID] = useState(null);

  const [otp, setOtp] = useState('');
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(true); // Initially open the dialog

  // Decrypt the values
  useEffect(() => {
    if (VID && URLOTP && EXPDate && SurveyNo && InitationID) {
      try {
        const decryptedVID = decryptLink(VID);
        const decryptedOTP = decryptLink(URLOTP);
        const decryptedSurveyNo = decryptLink(SurveyNo);
        const decryptedEXPDate = decryptLink(EXPDate);
        const decryptedInitationID = decryptLink(InitationID);

        setDecVID(decryptedVID);
        setDecOTP(decryptedOTP);
        setDecSurveyNo(decryptedSurveyNo);
        setDecEXPDate(decryptedEXPDate);
        setDecryptedInitationID(decryptedInitationID);
      } catch (error) {
        console.error('Decryption Error');
      }
    } else {
      console.error('Something went wrong');
    }
  }, [VID, URLOTP, EXPDate, SurveyNo, InitationID]);


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
      <Container maxWidth="lg">
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
          <SurveyFormSubmission VID={decVID} SvNo={decSurveyNo} EXPDate={decEXPDate} InitationID={decryptedInitationID} />
        )}
      </Container>
    </>
  );
};

export default page;

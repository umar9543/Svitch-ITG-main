import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useSnackbar } from 'src/components/snackbar';

import { LoadingScreen } from 'src/components/loading-screen';
import { decrypt, encrypt } from 'src/api/encryption';
import Editor from 'src/components/editor';
import Iconify from 'src/components/iconify';

import { Post } from 'src/utils/AxiosHelper';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { fDate } from 'src/utils/format-time';

export default function EmailFormDialog({
  open,
  onClose,
  supplierData,
  FetchNewData,
  linkToCopy,
  expiryDateISO,
  OTP,
}) {
  const { enqueueSnackbar } = useSnackbar();

  // create date from 7 days from today
  const oneMonthFromToday = new Date();
  oneMonthFromToday.setMonth(oneMonthFromToday.setMonth() + 1);

  // Date In SQL format
  function formatDate(dateString) {
    // Create a new Date object from the input string
    const date = new Date(dateString);

    // Extract the day, month, and year
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    const year = date.getFullYear();

    // Return the formatted date as dd.mm.yyyy
    return `${day}-${month}-${year}`;
  }

  const [isLoading, setIsLoading] = useState(false);
  const [emailDialogModel, setEmailDialogModel] = useState({});
  const [isCCSelected, setIsCCSelected] = useState(false);

  const userData = useMemo(() => JSON.parse(localStorage.getItem('UserData')), []);

  const emailTemplate = `<p>Dear ${supplierData?.VenderName},</p>
      <p>We noticed that your BSCI Report is either about to expire or has already expired. To ensure compliance within our supply chain and to meet audit requirements, we kindly request you to submit your updated BSCI Report.</p>
      <p>Please upload your latest report via the following link, OTP will be required to access the link: <strong>${OTP}</strong></p>
      <p><a href=${linkToCopy} >[Submit BSCI Report Link]</a></p>  
      <p>To avoid any disruption to our collaboration, we kindly ask you to complete the submission by  ${fDate(
        expiryDateISO
      )}</p>
      <p>If you have any questions or require assistance, please feel free to contact our support team: <a href="mailto:support@applied-csr.com">support@applied-csr.com</a>.</p>
      <p>Thank you for your cooperation and support!</p>
      <p>Best regards,</p>
      <p>The CEI Conrad Electronic Int'l (HK) Ltd. Team</p>
      `;

  const ifNotUploadedTemplate = `<p>Dear ${supplierData?.VenderName},</p>
      <p>We noticed that you have not uploaded BSCI Report. To ensure compliance within our supply chain and to meet audit requirements, we kindly request you to submit your updated BSCI Report.</p>
      <p>Please upload your latest report via the following link, OTP will be required to access the link: <strong>${OTP}</strong></p>
      <p><a href=${linkToCopy} >[Submit BSCI Report Link]</a></p>  
      <p>To avoid any disruption to our collaboration, we kindly ask you to complete the submission by  ${fDate(
        expiryDateISO
      )}</p>
      <p>If you have any questions or require assistance, please feel free to contact our support team: <a href="mailto:support@applied-csr.com">support@applied-csr.com</a>.</p>
      <p>Thank you for your cooperation and support!</p>
      <p>Best regards,</p>
      <p>The CEI Conrad Electronic Int'l (HK) Ltd. Team</p>
      `;

  useEffect(() => {
    setEmailDialogModel({
      VenderLibraryID: supplierData?.VenderLibraryID,
      MailBody: supplierData?.Status !== 'Not Uploaded' ? emailTemplate : ifNotUploadedTemplate,
      Subject: 'Action Required: Submission of Updated BSCI Report',
      MailCC: isCCSelected ? `${decrypt(userData[0].EmailId)}` : '',
      EmailTo: supplierData?.OnBoardingEmail,
    });
  }, [supplierData, isCCSelected, userData]);

  const renderLoading = (
    <LoadingScreen
      sx={{
        borderRadius: 1.5,
        bgcolor: 'background.default',
        mb: 3,
      }}
    />
  );

  const EmailDataSchema = Yup.object().shape({
    emailTo: Yup.string().required('Recipient is required'),
  });
  const defaultValues = {
    emailTo: supplierData?.OnBoardingEmail || '',
  };

  const methods = useForm({
    resolver: yupResolver(EmailDataSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const SendEmail = useCallback(
    async (emailDataParams) => {
      try {
        const encryptedBookingEmailData = Object.assign(
          {},
          ...Object.keys(emailDataParams).map((key) => ({
            [key]: encrypt(emailDataParams[key]),
          }))
        );
        await Post(`SentCertificateReminderEmail`, encryptedBookingEmailData);

        reset();
        enqueueSnackbar('Email Sent!');
        onClose();
        FetchNewData();
      } catch (error) {
        console.log(error);
        enqueueSnackbar('An Unexpected Error Occurred!', { variant: 'error' });
      }
    },
    [reset, enqueueSnackbar, onClose, FetchNewData]
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      const updatedEmailBody = { ...emailDialogModel };
      await SendEmail(updatedEmailBody);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
    }
  });

  const [message, setMessage] = useState('');

  const handleChangeMessage = useCallback(
    (value) => {
      setEmailDialogModel({ ...emailDialogModel, MailBody: value });
    },
    [emailDialogModel]
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {isLoading ? (
        renderLoading
      ) : (
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container>
            <Grid xs={12} md={12}>
              <DialogContent sx={{ padding: '0px' }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{
                    bgcolor: 'background.neutral',
                    p: (theme) => theme.spacing(1.5, 1, 1.5, 2),
                  }}
                >
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Compose Email
                  </Typography>

                  <IconButton onClick={onClose}>
                    <Iconify icon="mingcute:close-line" />
                  </IconButton>
                </Stack>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(1, 1fr)',
                    md: 'repeat(1, 1fr)',
                  }}
                  sx={{ p: 2 }}
                >
                  <RHFTextField
                    value={emailDialogModel?.EmailTo}
                    name="emailTo"
                    label="To"
                    variant="standard"
                    onChange={(e) =>
                      setEmailDialogModel({ ...emailDialogModel, EmailTo: e.target.value })
                    }
                  />
                  <RHFTextField
                    name="subject"
                    label="Subject"
                    variant="standard"
                    disabled
                    defaultValue="Action Required: Submission of Updated BSCI Report"
                  />
                </Box>
                <Stack spacing={2} sx={{ p: 2 }}>
                  <Editor
                    simple
                    id="compose-mail"
                    defaultValue={
                      supplierData?.Status !== 'Not Uploaded'
                        ? emailTemplate
                        : ifNotUploadedTemplate
                    }
                    onChange={handleChangeMessage}
                    placeholder="Type a message"
                  />

                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    {userData[0].OnBoardingEmail !== '' ? (
                      <FormControlLabel
                        label="Add me to cc"
                        control={
                          <Checkbox
                            size="small"
                            checked={isCCSelected}
                            onChange={(e) => setIsCCSelected(e.target.checked)}
                          />
                        }
                      />
                    ) : (
                      <Tooltip
                        placement="top"
                        arrow
                        title="Please add your email first"
                        sx={{ maxWidth: 500 }}
                      >
                        <FormControlLabel
                          sx={{ color: 'red' }}
                          label="Add me to cc"
                          control={<Checkbox size="small" color="error" checked={false} />}
                        />
                      </Tooltip>
                    )}
                    <LoadingButton
                      color="primary"
                      endIcon={<Iconify icon="iconamoon:send-fill" />}
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                    >
                      Send
                    </LoadingButton>
                  </Stack>
                </Stack>
              </DialogContent>
            </Grid>
          </Grid>
        </FormProvider>
      )}
    </Dialog>
  );
}

EmailFormDialog.propTypes = {
  open: PropTypes.any,
  onClose: PropTypes.any,
  supplierData: PropTypes.object,
  FetchNewData: PropTypes.func,
  expiryDateISO: PropTypes.any,
  OTP: PropTypes.any,
};

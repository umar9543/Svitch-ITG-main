import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { paths } from 'src/routes/paths';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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

import { Get, Post, Put } from 'src/utils/AxiosHelper';

import FormProvider, { RHFEditor, RHFTextField } from 'src/components/hook-form';
import { getDecryptedUserData } from 'src/utils/getUser';

export default function EmailFormDialog({ open, onClose, supplierData, FetchNewData, linkToCopy }) {
  const { enqueueSnackbar } = useSnackbar();

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

  // Example usage
  // const inputDate = '9/28/2024 12:00:00 AM';
  // const formattedDate = formatDate(inputDate);
  // console.log(formattedDate); // Output: 28.09.2024

  const [isLoading, setIsLoading] = useState(false);
  const [emailDialogModel, setEmailDialogModel] = useState({});
  const [isCCSelected, setIsCCSelected] = useState(false);

  // const VID = encrypt(supplierData.SupplierID);
  // const BID = encrypt(supplierData.OnBoardingDTLID);
  // const linkToCopy = `https://svitch-itg.vercel.app/SupplierOnboard/VID=${VID}&OnBoardingDTLID=${BID}`; // Your specific link

  // console.log('supplierData', supplierData);

  const userData = useMemo(() => JSON.parse(localStorage.getItem('UserData')), []);

  const emailTemplate = `<p>Dear ${supplierData.VenderName},</p>
      <p>We want to invite you to join the supply chain management system. This platform has helped our company, CEI, gain complete supply chain visibility.</p>
      <p>To register to the system, you must fill out the required information. To do so, please click the below link and update your company information.</p>
      <p><a href=${linkToCopy} >[Update Company Info Link]</a></p>  
      <p>It would be highly appreciated if you could complete and submit the info to us on or before ${formatDate(
        supplierData.ReleaseDate
      )}</p>
      <p>If you have any questions, please get in touch with IT Support at <a href="mailto:support@applied-csr.com">support@applied-csr.com</a>.</p>
      <p>Thanks & best regards</p>
      <p>CEI Conrad Electronic Int'l (HK) Ltd. Team</p>
      `;

  useEffect(() => {
    setEmailDialogModel({
      MailBody: emailTemplate,
      Subject: 'Invite to join the Svitch Supply Chain Management System!',
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
        const OnBoardingDTL = {
          OnBoardingDTLID: encrypt(supplierData.OnBoardingDTLID),
        };
        await Put(`SendEmail`, encryptedBookingEmailData);

        // Then, update the email sent status
        await Put(`UpdateEmailSent`, OnBoardingDTL);

        // After both requests are successful, execute the following code
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
                    defaultValue="Invite to join the Svitch Supply Chain Management System!"
                  />
                </Box>
                <Stack spacing={2} sx={{ p: 2 }}>
                  <Editor
                    simple
                    id="compose-mail"
                    defaultValue={emailTemplate}
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
};

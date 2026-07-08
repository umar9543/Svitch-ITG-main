'use client';
import React, { useEffect } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Scrollbar from 'src/components/scrollbar';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { countries } from 'src/assets/data';
// import IncrementDecrementInput from 'src/components/IncrementDecrementInput';

import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFRadioGroup,
} from 'src/components/hook-form';
import {
  Autocomplete,
  ButtonGroup,
  Checkbox,
  Chip,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { format, parse } from 'date-fns';

import { Get, Post, Put } from 'src/utils/AxiosHelper';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { getDecryptedUserData } from 'src/utils/getUser';
import { getCountries } from 'src/utils/Countries';
import Iconify from 'src/components/iconify';
import EmailFormDialog from './EmailFormDialog';
import { decrypt, encrypt } from 'src/api/encryption';

// ----------------------------------------------------------------------

function getCurrentDate() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

function generateRandomPassword() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';

  // Loop to generate a 6 character password
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  return password;
}

export default function OnBoardingInviteNewEditForm({ currentOnBoardingInvite }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const userID = getDecryptedUserData() ? getDecryptedUserData()[0].UserID : 86;
    const UserData = getDecryptedUserData();
  

  const [ReleaseDate, setReleaseDate] = useState(null);

  const createdBy = getDecryptedUserData()[0].UserID;

  // const [score, setScore] = useState(scoreValues[0]);
  // const [score1, setScore1] = useState(scoreValues[0]);
  // const [currentDate, setCurrentDate] = useState(getCurrentDate());
  // const [activeClass, setActiveClass] = useState(null); // Track the active class
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [IndustryType, setIndustryType] = useState([]);
  const [ParticipantType, setParticipantType] = useState([]);
  const [SupplierName, setSupplierName] = useState([]);
  const [VendorTableData, setVendorTableData] = useState([]);

  const [NewData, setNewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [UserGenerateID, setUserGenerateID] = useState('');
  const [OnboardMstId, setOnboardMstId] = useState('');
  const countries = getCountries();

  // const [isEmailSent, setIsEmailSent] = useState(false);
  // const selectedCountry = country.find((c) => c.Country_id === CountryID);

  const getFlagByCountryCode = (countryName) => {
    const country = countries.find((c) => c.label.toLowerCase() === countryName?.toLowerCase());
    return country ? `flagpack:${country?.code?.toLowerCase()}` : '';
  };

  const NewOnBoardingInviteSchema = Yup.object().shape({
    // CustomerID: Yup.array()
    //   .min(1, 'Please select at least one customer')
    //   .required('Customer is required'),
    IndustryTypeID: Yup.string().required('Industry Type is required'),
    PartyTypeId: Yup.string().required('Participant Type is required'),
    SupplierID: Yup.array()
      .min(1, 'Please select at least one supplier')
      .required('Supplier Name is required'),
    ReleaseDate: Yup.string().required('Date is required'),
  });

  const getFilteredCustomers = async () => {
    try {
      const res = await Get(`GetFilteredDataCustomer?UserID=${userID}`);
      const decryptedFilteredCustomers = decryptObjectKeys(res.data.ServiceRes);
      setFilteredCustomers(decryptedFilteredCustomers);
    } catch (error) {
      console.log('error getting supplier filtered customers', error);
    }
  };
  const getIndustryType = async () => {
    try {
      const res = await Get(`GetIndustryType?UserID=${userID}`);
      const decryptedFilteredCustomers = decryptObjectKeys(res.data.ServiceRes);
      setIndustryType(decryptedFilteredCustomers);
    } catch (error) {
      console.log('error getting supplier industry type', error);
    }
  };

  useEffect(() => {
    getFilteredCustomers();
    getIndustryType();
  }, []);

  const customerIds = currentOnBoardingInvite?.CustomerID?.split(',').map((id) => id.trim());
  const supplierIds = currentOnBoardingInvite?.VenderLibraryID?.split(',').map((id) => id.trim());

  const [selectedCustomers, setSelectedCustomers] = useState(customerIds || []);
  const [selectedSupplierName, setSelectedSupplierName] = useState(supplierIds || []);

  const defaultValues = useMemo(
    () => ({
      IndustryTypeID: currentOnBoardingInvite?.IndustryTypeID || '',
      // currentDate: currentDate,
    }),
    [currentOnBoardingInvite]
  );

  const [selectedIndustryType, setSelectedIndustryType] = useState();

  useEffect(() => {
    const getParticipantType = async () => {
      try {
        const res = await Get(`GetParticipantType?IndustryTypeID=${selectedIndustryType}`);
        const decryptedFilteredCustomers = decryptObjectKeys(res.data.ServiceRes);
        setParticipantType(decryptedFilteredCustomers);
      } catch (error) {
        console.log('error getting supplier participant type', error);
      }
    };
    const getSupplierName = async () => {
      try {
        const res = await Get(
          `GetVendorNames_OnBoarding?CustomerID=${
            getDecryptedUserData()[0].CustomerId
          }&IndustryTypeID=${selectedIndustryType}`
        );
        const decryptedFilteredCustomers = decryptObjectKeys(res.data.ServiceRes);
        // console.log('decryptedFilteredCustomers', decryptedFilteredCustomers);
        setSupplierName(decryptedFilteredCustomers);
      } catch (error) {
        console.log('error getting supplier participant type', error);
      }
    };
    getParticipantType();
    getSupplierName();
  }, [selectedIndustryType]);

  const GetVendorTableData = async () => {
    try {
      // Make concurrent API requests for each selectedSupplierName
      const responses = await Promise.all(
        selectedSupplierName.map(async (supplierID) => {
          const res = await Get(`GetVendorData?VenderLibraryID=${supplierID}`);
          return decryptObjectKeys(res.data.ServiceRes); // Decrypt each response data
        })
      );

      // Flatten the array in case each response returns an array of vendors
      const decryptedFilteredCustomers = responses.flat();

      // Update the state with the combined data
      setVendorTableData(decryptedFilteredCustomers);
    } catch (error) {
      console.log('Error getting supplier filtered customers', error);
    }
  };

  // console.log('selectedSupplierName', selectedSupplierName);
  const methods = useForm({
    resolver: yupResolver(NewOnBoardingInviteSchema),
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

  const InsertOnboardDetail = async (onBoardingDetails) => {
    const encryptedData = onBoardingDetails.map((X) =>
      Object.assign(
        {},
        ...Object.keys(X).map((key) => ({
          [key]: encrypt(X[key]),
        }))
      )
    );
    try {
      const res = await Post(`InsertOnBoardingDtl`, encryptedData);
      if (res.data.ResponseCode == '100') {
        console.log('onBoardingDetails inserted successfully');
      } else {
        console.log('error inserting onBoardingDetail api', error);
      }
    } catch (error) {
      console.log('error inserting onBoardingDetail', error);
    }
  };

  const InsertOnBoardingUser = async (userData) => {
    try {
      // Encrypt the user data
      const encryptedUserData = userData.map((X) =>
        Object.assign(
          {},
          ...Object.keys(X).map((key) => ({
            [key]: encrypt(X[key]),
          }))
        )
      );

      // Loop through each user data and process sequentially
      for (let i = 0; i < encryptedUserData.length; i++) {
        const encryptedData = encryptedUserData[i]; // Current user data

        try {
          // Step 1: Insert the user and get the UserId
          const res = await Post('InsertOnBoardingUser', encryptedData);
          if (res.data.ResponseCode === '100') {
            const decryptedUserId = decrypt(res.data.ServiceRes[0].UserId);
            // Step 2: Insert user role
            const decryptUserId = {
              UserId: res.data.ServiceRes[0].UserId,
            };
            await Post('InsertUserRole', decryptUserId);

            // Step 3: Insert user department
            await Post('InsertUserDept', decryptUserId);

            // Step 4: Prepare onBoardingDetails for this user
            const onBoardingDetails = {
              OnBoardingMSTID: userData[0].OnBoardingMSTID, // Using the same MSTID for all users
              SupplierID: VendorTableData[i].SupplierID || '',
              CountryID: VendorTableData[i].CountryID || '',
              Address1: VendorTableData[i].Address || '',
              City: VendorTableData[i].City || '',
              Email: VendorTableData[i].Email || '',
              UserGenerateID: decryptedUserId, // Use the UserId for this user
              CustomerQuestionariesMstid: '',
              PartyTypeId: VendorTableData[i].PartyTypeId || '',
              IsEmailSent: '0',
            };

            // Step 5: Insert onboarding details
            await InsertOnboardDetail([onBoardingDetails]);
          } else {
            console.log(`Something Went Wrong with user ${i}`, res.data);
          }
        } catch (error) {
          console.log(`Error inserting data for user ${i}:`, error);
        }
      }

      console.log('All users processed successfully.');
    } catch (error) {
      console.log('Error in InsertOnBoardingUser:', error);
    }
  };

  const InsertOnboardMaster = async (data) => {
    if (VendorTableData.length <= 0) {
      return enqueueSnackbar('Please add atleast one participant', { variant: 'warning' });
    }

    const newdata = {
      UserID: getDecryptedUserData()[0].UserID,
      CustomerID: selectedCustomers.join(', ') || [UserData[0]?.CustomerId],
      ReleaseDate: data?.ReleaseDate,
    };

    const encryptMasterData = Object.assign(
      {},
      ...Object.keys(newdata).map((key) => ({
        [key]: encrypt(newdata[key]),
      }))
    );
    try {
      setIsLoading(true);
      const res = await Post(`InsertOnBoardingMST`, encryptMasterData);
      if (res.data.ResponseCode == '100') {
        const onBoardingMSTID = decrypt(res.data.ServiceRes[0].OnBoardingMSTID);
        setOnboardMstId(decrypt(res.data.ServiceRes[0].OnBoardingMSTID));

        const userData = VendorTableData.map((item) => {
          return {
            UserCode: item.SupplierName.split(' ')[0].toLowerCase(),
            Password: generateRandomPassword(), // Generate a random password for each user
            UserName: item.SupplierName, // Use the individual SupplierName
            CustomerId: selectedCustomers.join(', '), // Join selected customers as a string
            EmailId: item.Email, // Use the individual Email
            CreatedBy: createdBy,
            OnBoardingMSTID: decrypt(res.data.ServiceRes[0].OnBoardingMSTID),
            OnBoardingSupplierID: item.SupplierID, // Use the individual SupplierID
          };
        });

        await InsertOnBoardingUser(userData);
        enqueueSnackbar('Onboarding Invite created successfully');
        router.push(paths.dashboard.OnBoarding.inviteParticipant.root);
      } else {
        console.log('Error in InsertOnboardMaster');
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
      }
    } catch (error) {
      console.log('an error occured in InsertOnboardMaster api', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // enqueueSnackbar(currentOnBoardingInvite ? 'Update success!' : 'Create success!');
      // reset();
      // router.push(paths.dashboard.OnBoardingInvite.root);
      setNewData(data);
      GetVendorTableData();
    } catch (error) {
      console.error(error);
    }
  });

  //**************************************** // Email Management start //***************************************** */
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const SentEmail = async (data) => {
    if (VendorTableData.length <= 0) {
      return enqueueSnackbar('Please add atleast one participant', { variant: 'warning' });
    }
    await InsertOnboardMaster(NewData);

    VendorTableData.map(async (item) => {
      const emailTemplate = `<p>Dear ${item.SupplierName},</p>
      <p>We want to invite you to join the supply chain management system. This platform has helped our company, CEI, gain complete supply chain visibility.</p>
      <p>To register to the system, you must fill out the required information. To do so, please click the below link and update your company information.</p>
      <p>[Update Company Information link]</p>  
      <p>It would be highly appreciated if you could complete and submit the info to us on or before [date]</p>
      <p>If you have any questions, please get in touch with IT Support.  [support mail]</p>
      <p>Thanks & best regards</p>
      <p>Svitch System</p>
      `;

      const emailData = {
        EmailTo: item.Email,
        MailBody: emailTemplate,
        MailCC: '',
        Subject: 'Invite to join the Svitch Supply Chain Management System!',
      };

      const encryptEmailData = Object.assign(
        {},
        ...Object.keys(emailData).map((key) => ({
          [key]: encrypt(emailData[key]),
        }))
      );

      try {
        setIsLoading(true);
        const res = await Put(`SendEmail`, encryptEmailData);
        console.log('res', res);
        if (res.data.ResponseCode == '100') {
          enqueueSnackbar('Email sent successfully');
          router.push(paths.dashboard.OnBoarding.inviteParticipant.root);
        } else {
          enqueueSnackbar('Error while sending Email!', { variant: 'error' });
        }
      } catch (error) {
        console.log('an error occured in InsertOnboardMaster api', error);
      } finally {
        setIsLoading(false);
        // setIsEmailSent(false);
      }
    });
  };
  //**************************************** // Email Management end //***************************************** */
  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Particpant Invitation Setup
              </Typography>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  // md: 'repeat(3, 1fr)',
                }}
              >
                {/* <Controller
                  name="CustomerID"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      multiple
                      autoHighlight
                      disableCloseOnSelect
                      options={filteredCustomers}
                      getOptionLabel={(option) => option.CustomerName}
                      onChange={(event, newValue) => {
                        field.onChange(newValue.map((group) => group.CustomerID));
                        setSelectedCustomers(newValue.map((group) => group.CustomerID));
                      }}
                      value={
                        filteredCustomers.filter((group) =>
                          selectedCustomers?.includes(group.CustomerID)
                        ) || []
                      }
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} style={{ marginRight: 8 }} />
                          {option.CustomerName}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Customer"
                          error={!!error}
                          helperText={error ? error.message : ''}
                        />
                      )}
                      renderTags={(selected, getTagProps) => {
                        const maxVisibleChips = 2;
                        return (
                          <>
                            {selected.slice(0, maxVisibleChips).map((option, index) => (
                              <Chip
                                key={option.CustomerID}
                                label={option.CustomerName}
                                {...getTagProps({ index })}
                                color="primary"
                              />
                            ))}
                            {selected.length > maxVisibleChips && (
                              <Chip
                                label={`+${selected.length - maxVisibleChips} more`}
                                color="primary"
                              />
                            )}
                          </>
                        );
                      }}
                    />
                  )}
                /> */}

                <Controller
                  name="IndustryTypeID"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState: { error } }) => (
                    <RHFAutocomplete
                      {...field}
                      options={IndustryType}
                      getOptionLabel={(option) => option.IndustryName || ''}
                      isOptionEqualToValue={(option, value) => option.IndustryTypeID === value}
                      value={
                        IndustryType.find((init) => init.IndustryTypeID === field.value) || null
                      }
                      onChange={(event, newValue) => {
                        field.onChange(newValue ? newValue.IndustryTypeID : '');
                        setSelectedIndustryType(newValue ? newValue.IndustryTypeID : '');
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Industry Type"
                          variant="outlined"
                          fullWidth
                          error={!!error}
                          helperText={error ? error.message : ''}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="PartyTypeId"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState: { error } }) => (
                    <RHFAutocomplete
                      {...field}
                      options={ParticipantType}
                      getOptionLabel={(option) => option.PartyType || ''}
                      isOptionEqualToValue={(option, value) => option.PartyTypeId === value}
                      value={
                        ParticipantType.find((init) => init.PartyTypeId === field.value) || null
                      }
                      onChange={(event, newValue) => {
                        field.onChange(newValue ? newValue.PartyTypeId : '');
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Participant Type"
                          variant="outlined"
                          fullWidth
                          error={!!error}
                          helperText={error ? error.message : ''}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="SupplierID"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      multiple
                      autoHighlight
                      disableCloseOnSelect
                      options={SupplierName}
                      getOptionLabel={(option) => option.VenderName}
                      onChange={(event, newValue) => {
                        field.onChange(newValue.map((group) => group.VenderLibraryID));
                        setSelectedSupplierName(newValue.map((group) => group.VenderLibraryID));
                      }}
                      value={
                        SupplierName.filter((group) =>
                          selectedSupplierName?.includes(group.VenderLibraryID)
                        ) || []
                      }
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} style={{ marginRight: 8 }} />
                          {option.VenderName}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Supplier"
                          error={!!error}
                          helperText={error ? error.message : ''}
                        />
                      )}
                      renderTags={(selected, getTagProps) => {
                        const maxVisibleChips = 2;
                        return (
                          <>
                            {selected.slice(0, maxVisibleChips).map((option, index) => (
                              <Chip
                                key={option.VenderLibraryID}
                                label={option.VenderName}
                                {...getTagProps({ index })}
                                color="primary"
                              />
                            ))}
                            {selected.length > maxVisibleChips && (
                              <Chip
                                label={`+${selected.length - maxVisibleChips} more`}
                                color="primary"
                              />
                            )}
                          </>
                        );
                      }}
                    />
                  )}
                />

                {/* <RHFTextField name="Address" label="Address" sx={{ gridColumn: 'span 2' }} /> */}
                <Controller
                  name="ReleaseDate"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <DesktopDatePicker
                      label="Best Before"
                       format="dd/MM/yyyy"
                      value={ReleaseDate}
                      onChange={(newValue) => {
                        setReleaseDate(newValue);
                        field.onChange(format(newValue, 'yyyy-MM-dd'));
                      }}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  )}
                />
              </Box>

              <Box display="flex" justifyContent="end">
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  sx={{ mt: 3 }}
                  loading={isSubmitting}
                >
                  Add
                </Button>
              </Box>

              {VendorTableData.length > 0 && (
                <Scrollbar>
                  <TableContainer>
                    <Table sx={{ mt: 3 }}>
                      <TableHead>
                        <TableRow>
                          {/* <TableCell>Industry Type</TableCell>
                          <TableCell>Participant Type</TableCell> */}
                          <TableCell>Supplier</TableCell>
                          {/* <TableCell>Address</TableCell> */}
                          <TableCell>Country</TableCell>
                          <TableCell>City</TableCell>
                          <TableCell>Email</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {VendorTableData?.map((row) => (
                          <TableRow key={row.VendorID}>
                            {/* <TableCell>{row.IndustryTypeID}</TableCell>
                            <TableCell>{row.PartyTypeId}</TableCell> */}
                            <TableCell>{row.SupplierName}</TableCell>
                            {/* <TableCell>{row.Address}</TableCell> */}
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                              <Stack direction="row" alignItems="center">
                                <Iconify
                                  icon={getFlagByCountryCode(row?.Country)}
                                  sx={{ borderRadius: 0.65, border: '1px gray ', width: 28, mr: 1 }}
                                />
                                {row.Country}
                              </Stack>
                            </TableCell>
                            <TableCell>{row.City}</TableCell>
                            <TableCell>{row.Email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
              )}
            </Card>

            {/* <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Do you want to include any assessment at the time of onboarding{' '}
            </Typography>
            <Box
              rowGap={3}
              columnGap={2}
              display="flex"
              flexDirection="row"
              alignItems="center"

              // gridTemplateColumns={{
              //   xs: 'repeat(1, 1fr)',
              //   sm: 'repeat(2, 1fr)',
              // }}
            >
              <label htmlFor="Choose one" sx={{ mr: 3 }}>
                Choose one
              </label>
              <RadioGroup row aria-labelledby="Choose one" name="row-radio-buttons-group">
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
                <FormControlLabel value="disabled" disabled control={<Radio />} label="other" />
              </RadioGroup>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2, mt: 3 }}>
              <Button variant="contained" color="primary">
                Add More
              </Button>
            </Box>
          </Card> */}

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {/* <LoadingButton
                  // type="submit"
                  variant="contained"
                  // type="submit"
                  loading={isLoading}
                  color="primary"
                  onClick={() => {
                    setIsEmailSent(true);
                    SentEmail(NewData);
                  }}
                >
                  Save & Email
                </LoadingButton> */}
                <LoadingButton
                  // type="submit"
                  variant="contained"
                  color="primary"
                  loading={isLoading}
                  onClick={() => {
                    InsertOnboardMaster(NewData);
                  }}
                >
                  Save Changes
                </LoadingButton>
                <Button size="medium" variant="outlined">
                  Cancel
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>
      <EmailFormDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        VendorTableData={VendorTableData}
        // FetchNewData={() => {
        //   FetchUpdatedData();
        // }}
      />
    </>
  );
}

OnBoardingInviteNewEditForm.propTypes = {
  currentOnBoardingInvite: PropTypes.object,
};

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
import Editor from 'src/components/editor';

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

  const [BestBefore, setReleaseDate] = useState(null);

  const createdBy = getDecryptedUserData()[0].UserID;

  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [SurveyNo, setSurveyNo] = useState([]);
  const [ParticipantType, setParticipantType] = useState([]);
  const [SupplierName, setSupplierName] = useState([]);
  const [VendorTableData, setVendorTableData] = useState([]);
  const [countryMarket, setCountryMarket] = useState([]);

  const [NewData, setNewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [UserGenerateID, setUserGenerateID] = useState('');
  const [OnboardMstId, setOnboardMstId] = useState('');
  const countries = getCountries();

  // const [isEmailSent, setIsEmailSent] = useState(false);
  // const selectedCountry = country.find((c) => c.CountryID === CountryID);

  const getFlagByCountryCode = (countryName) => {
    const country = countries.find((c) => c.label.toLowerCase() === countryName?.toLowerCase());
    return country ? `flagpack:${country?.code?.toLowerCase()}` : '';
  };

  const NewOnBoardingInviteSchema = Yup.object().shape({
    SurveyNo: Yup.object().required('Survey No. is required'),
    Country: Yup.array()
      .min(1, 'Please select at least one Country')
      .required('Country is required'),
    SupplierID: Yup.array()
      .min(1, 'Please select at least one supplier')
      .required('Supplier is required'),
    BestBefore: Yup.string().required('Date is required'),
  });

  const getSurveyNo = async () => {
    try {
      const res = await Get(`GetServeyNo?CustomerID=${UserData[0].CustomerId}`);
      const decryptedFilteredCustomers = decryptObjectKeys(res.data.ServiceRes);
      setSurveyNo(decryptedFilteredCustomers);
    } catch (error) {
      console.log('error getting supplier survey no.', error);
    }
  };
  const getCountryMarket = async () => {
    try {
      const res = await Get(`GetCountry_Suppliers`);
      const decryptedCountryMarket = decryptObjectKeys(res.data.ServiceRes);
      setCountryMarket(decryptedCountryMarket);
    } catch (error) {
      console.log('error getting supplier main export market', error);
    }
  };

  useEffect(() => {
    getSurveyNo();
    getCountryMarket();
  }, []);

  const supplierIds = currentOnBoardingInvite?.VenderLibraryID?.split(',').map((id) => id.trim());
  const countryMarketIds = currentOnBoardingInvite?.CountryMarketId?.split(',').map((id) =>
    id.trim()
  );
  const [selectedSupplierName, setSelectedSupplierName] = useState(supplierIds || []);
  const [selectedMarkets, setSelectedMarkets] = useState(countryMarketIds || []);

  const defaultValues = useMemo(
    () => ({
      SurveyNo: currentOnBoardingInvite?.SurveyNo || null,

      // currentDate: currentDate,
    }),
    [currentOnBoardingInvite]
  );
  useEffect(() => {
    setSelectedMarkets(defaultValues.CountryMarketId);
    setSelectedSupplierName(SupplierName?.map((item) => item.VenderLibraryID));
  }, [defaultValues]);

  const methods = useForm({
    resolver: yupResolver(NewOnBoardingInviteSchema),
    defaultValues,
  });

  const getSupplier = async () => {
    try {
      const res = await Get(
        `GetSupplierByMultiPleCountryID?CountryID=${selectedMarkets.join(',')}`
      );
      const decryptedFilteredCustomers = decryptObjectKeys(res.data.ServiceRes);
      setSupplierName(decryptedFilteredCustomers);
    } catch (error) {
      setSupplierName([]);
      console.log('error getting supplier filtered customers', error);
    }
  };
  useEffect(() => {
    getSupplier();
  }, [selectedMarkets]);

  const handleCountryChange = (newValue) => {
    setSelectedMarkets(newValue?.map((group) => group.CountryID));
    // Filter selected suppliers based on the new selected countries
    const newSelectedSuppliers = selectedSupplierName.filter((supplierId) => {
      const supplier = SupplierName.find((sup) => sup.VenderLibraryID === supplierId);
      return supplier && newValue?.some((country) => country.CountryID === supplier.CountryID);
    });
    setSelectedSupplierName(newSelectedSuppliers);
  };

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const InsertSurveyInvitations = async (dt) => {
    try {
      const res = await Post(`InsertSurveyInvitations`, dt);
      if (res.data.ResponseCode === '100') {
        enqueueSnackbar(currentOnBoardingInvite ? 'Update success!' : 'Create success!');
        reset();
        router.push(paths.dashboard.RiskAnalysis.RiskMitigation.inviteParticipant.root);
      } else {
        enqueueSnackbar('Error Inserting Supplier Invitations', { variant: 'error' });
      }
    } catch (error) {
      console.log('error getting supplier filtered customers', error);
      enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const DataToInsert = values?.SupplierID.map((supp) => ({
        SurveyNo: data?.SurveyNo?.SurveyNo,
        Context: data?.SurveyNo?.Context,
        CountryID: supp?.CountryID,
        SupplierID: supp?.VenderLibraryID,
        BestBefore: format(new Date(data?.BestBefore), 'yyyy-MM-dd'),
        UserID: createdBy,
        CustomerID: UserData[0].CustomerId,
      }));
      const encryptedData = DataToInsert?.map((X) =>
        Object.assign(
          {},
          ...Object.keys(X).map((key) => ({
            [key]: encrypt(X[key]),
          }))
        )
      );

      await InsertSurveyInvitations(encryptedData);
    } catch (error) {
      console.error(error);
    }
  });

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
                <Controller
                  name="SurveyNo"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState: { error } }) => (
                    <RHFAutocomplete
                      {...field}
                      options={SurveyNo}
                      getOptionLabel={(option) => option?.SurveyNo || ''}
                      isOptionEqualToValue={(option, value) => option?.SurveyNo === value}
                      value={
                        SurveyNo?.find((init) => init.SurveyNo === values?.SurveyNo?.SurveyNo) ||
                        null
                      }
                      onChange={(event, newValue) => {
                        field.onChange(newValue ? newValue : '');
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Survey No."
                          variant="outlined"
                          fullWidth
                          error={!!error}
                          helperText={error ? error.message : ''}
                        />
                      )}
                    />
                  )}
                />
                <RHFTextField
                  name="Context"
                  label="Context"
                  value={values?.SurveyNo?.Context || null}
                  InputLabelProps={{ shrink: true }}
                  disabled
                />
                <Controller
                  name="Country"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      multiple
                      autoHighlight
                      disableCloseOnSelect
                      options={countryMarket}
                      getOptionLabel={(option) => option.CountryName}
                      onChange={(event, newValue) => {
                        field.onChange(newValue.map((group) => group));
                        handleCountryChange(newValue);
                      }}
                      value={
                        countryMarket.filter((group) =>
                          selectedMarkets?.includes(group.CountryID)
                        ) || []
                      }
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} style={{ marginRight: 8 }} />
                          {option.CountryName}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Country"
                          error={!!error}
                          helperText={error ? error.message : ''}
                        />
                      )}
                      renderTags={(selected, getTagProps) => {
                        const maxVisibleChips = 2;
                        return (
                          <>
                            {selected?.slice(0, maxVisibleChips).map((option, index) => (
                              <Chip
                                key={option.CountryID}
                                label={option.CountryName}
                                {...getTagProps({ index })}
                                color="primary"
                              />
                            ))}
                            {selected?.length > maxVisibleChips && (
                              <Chip
                                label={`+${selected?.length - maxVisibleChips} more`}
                                color="primary"
                              />
                            )}
                          </>
                        );
                      }}
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
                        field.onChange(newValue.map((group) => group));
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
                        const maxVisibleChips = 1;
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

                <Controller
                  name="BestBefore"
                  control={control}
                  render={({ field }) => (
                    <DesktopDatePicker
                      label="Best Before"
                      format="dd/MM/yyyy"
                      value={field.value}
                      onChange={(newValue) => field.onChange(newValue)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  )}
                />
              </Box>
            </Card>

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
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={isLoading}
                >
                  Save
                </LoadingButton>
                <Button size="medium" variant="outlined">
                  Cancel
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}

OnBoardingInviteNewEditForm.propTypes = {
  currentOnBoardingInvite: PropTypes.object,
};

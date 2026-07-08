import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useCallback, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import { StepLabel, InputAdornment, Typography } from '@mui/material';
import Stepper from '@mui/material/Stepper';

import { LoadingScreen, SplashScreen } from 'src/components/loading-screen';

import { paths } from 'src/routes/paths';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';

import { decrypt } from 'src/api/encryption';
import { Get } from 'src/utils/AxiosHelper';
import { useRouter } from 'next/navigation';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { getDecryptedUserData } from 'src/utils/getUser';
import Link from 'next/link';
import { QaPreviewCreateView } from 'src/sections/qa-preview/view';
import QaPreviewNewEditForm from 'src/sections/qa-preview/qa-preview-new-edit-form';
import { decryptObjectKeys } from 'src/utils/getDecryption';


const mergeQuestionsByMstID = (data) => {
  return data.map((section) => {
    const mergedQuestions = [];

    section.Questions.forEach((question) => {
      const existingQuestion = mergedQuestions.find(
        (q) => q.QuestionnaireMstID === question.QuestionnaireMstID
      );

      if (existingQuestion) {
        existingQuestion.Choices = [...existingQuestion.Choices, ...question.Choices];
      } else {
        mergedQuestions.push({ ...question });
      }
    });

    return { ...section, Questions: mergedQuestions };
  });
};

// ----------------------------------------------------------------------

export default function SurveyFormSubmission({ VID, SvNo, InitationID }) {
  const router = useRouter();

  const userData = getDecryptedUserData();

  const { enqueueSnackbar } = useSnackbar();

  const decryptRecursiveObjectKeys = (data) => {
    if (Array.isArray(data)) {
      return data.map((item) => decryptRecursiveObjectKeys(item));
    } else if (typeof data === 'object' && data !== null) {
      const decryptedItem = {};
      Object.keys(data).forEach((key) => {
        decryptedItem[key] = decryptRecursiveObjectKeys(data[key]);
      });
      return decryptedItem;
    } else {
      return decrypt(data);
    }
  };

  // Date In SQL format
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // States
  const [masterModel, setMasterModel] = useState({
    Currency: 'CNY',
  });
  const [loading, setLoading] = useState(true);
  // const [allCountries, setAllCountries] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [surveyDetails, setSurveyDetails] = useState([]);
  const [vendorDetails, setVendorDetails] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // const GetCountryData = async () => {
  //   try {
  //     const res = await Get(`GetCountry?UserID=${userData[0]?.UserID}`);
  //     const decryptedData = decryptObjectKeys(res.data.ServiceRes);
  //     setAllCountries(decryptedData); // Assuming you're setting the filtered data here
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const GetSurveyDetails = useCallback(async () => {
    try {
      const res = await Get(`GetSurveyDetails?SurveyNo=${SvNo}`);
      const decryptedData = decryptObjectKeys(res?.data?.ServiceRes);
      setSurveyDetails(decryptedData); // Assuming you're setting the filtered data here
    } catch (error) {
      console.error(error);
    }
  }, [SvNo]);

  const GetVendorDetails = useCallback(async () => {
    try {
      const res = await Get(
        `GetSupplierDataByID?UserID=${userData ? userData[0]?.UserID : 265}&VenderLibraryID=${VID}`
      );
      const decryptedData = decryptObjectKeys(res?.data?.ServiceRes);
      setVendorDetails(decryptedData); // Assuming you're setting the filtered data here
    } catch (error) {
      console.error(error);
    }
  }, [VID]);

  const GetQuestionsBySurveyNo = async () => {
    try {
      const res = await Get(`GetQuestionsBySurvey?SurveyNo=${SvNo}`);
      const decryptedData = decryptRecursiveObjectKeys(res.data);
      const mergedData = mergeQuestionsByMstID(decryptedData);
      setTotalQuestions(mergedData.reduce((total, section) => total + section.Questions.length, 0));
      setAllQuestions(mergedData); // Assuming you're setting the filtered data here
    } catch (error) {
      console.error(error);
    }
  };
  // --------------------- Is All Data Fetched -------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          GetSurveyDetails(),
          GetVendorDetails(),
          // GetCountryData(),
          GetQuestionsBySurveyNo(),
        ]);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [GetSurveyDetails, GetVendorDetails]);
  //   ***************************************************

  // Section 1 schema
  const Section1Schema = Yup.object().shape({
    // CompanyName: Yup.string().required('Company Name is required'),
    // Country: Yup.object().required('Country is required'),
    AssessmentDate: Yup.mixed().required('Assessment Date is required'),
    RespondBy: Yup.string().required('Responded By is required'),
    JobTitle: Yup.string().required('Job Title is required'),
  });

  const methods = useForm({
    resolver: yupResolver(Section1Schema),
    defaultValues: {
      CompanyName: vendorDetails[0]?.CompanyName,
      AssessmentDate: new Date(), // Set current date as default
      // Country: allCountries.find((country) => country.CountryID === vendorDetails[0]?.CountryID),
      // RespondBy: userData[0]?.UserName,
      // JobTitle: userData[0]?.JobTitle,
    },
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const values1 = watch();

  // ----------------------------------------------------

  // Section 2 schema
  const Section2Schema = Yup.object().shape({
    // TotalCartons: Yup.string().required('Total Cartons is required'),
    // TotalNetWeight: Yup.string().required('Total Net Weight is required'),
    // TotalGrossWeight: Yup.string().required('Total Gross Weight is required'),
    // TotalVolume: Yup.string().required('Total Volume is required'),
    // TermsOfDelivery: Yup.string().required('Terms of Delivery is required'),
  });

  const methods2 = useForm({
    resolver: yupResolver(Section2Schema),
  });

  const {
    reset: resetSection2,
    watch: watchSection2,
    control: controlSection2,
    setValue: setValueSection2,
    handleSubmit: handleSubmitSection2,
    formState: { isSubmitting: isSubmittingSection2 },
  } = methods2;
  // -------------------------------------------

  // Section 3 schema
  const Section3Schema = Yup.object().shape({
    // ExporterCompanyName: Yup.string().required('Exporter Company Name is required'),
    // ExporterLegalAddress: Yup.string().required('Exporter Legal Address is required'),
    // ExporterPhoneNumber: Yup.string().required('Exporter Phone Number is required'),
  });

  const methods3 = useForm({
    resolver: yupResolver(Section3Schema),
  });

  const {
    reset: resetSection3,
    watch: watchSection3,
    control: controlSection3,
    setValue: setValueSection3,
    handleSubmit: handleSubmitSection3,
    formState: { isSubmitting: isSubmittingSection3 },
  } = methods3;

  // -------------------------------------------

  // ---------------------- XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ------------------------

  const moveToView = (e) => {
    // router.push(
    //   paths.dashboard.filemanager.invoiceView(
    //     encodeURIComponent(VID?.vendorId),
    //     encodeURIComponent(VID?.customerID),
    //     encodeURIComponent(VID?.folderName)
    //   ),
    //   { state: e }
    // );
  };
  const mstData = {
    CompanyName: vendorDetails[0]?.VenderName || '',
    JobTitle: values1?.JobTitle || '',
    RespondBy: values1?.RespondBy || '',
    AssessmentDate: values1?.AssessmentDate
      ? formatDate(values1?.AssessmentDate)
      : formatDate(new Date()),
    CountryID: surveyDetails[0]?.SurveyMarketID || '0',
    SupplierID: VID, ///VID
    SurveyNo: SvNo,
    Context: surveyDetails[0]?.Context || '',
    SurveyMarketID: surveyDetails[0]?.SurveyMarketID || '0',
    ProjectID: surveyDetails[0]?.ProjectID || '0',

    // TotalNoOfQuestions: totalQuestions?.toFixed(2),
    TotalNoOfQuestions: totalQuestions,
    UserID: userData ? userData[0]?.UserID : '1',
  };
  // section1 submit
  const onSubmit1 = handleSubmit(async (data) => {
    try {
      // const newData = {
      //   ...data,
      //   SupplierID: VID,
      //   SurveyNo: SvNo,
      //   Context: surveyDetails[0]?.Context || '',
      //   SurveyMarketID: surveyDetails[0]?.SurveyMarketID || '0',
      //   ProjectID: surveyDetails[0]?.ProjectID || '0',
      //   TotalNoOfQuestions: totalQuestions,
      //   UserID: userData ? userData[0]?.UserID : '1',
      // };
      handleNext();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
    }
  });

  // section2 submit
  const onSubmit2 = handleSubmitSection2(async (data) => {
    // if (DetailList.length === 0) {
    //   enqueueSnackbar('Please Add Detail!', { variant: 'error' });
    //   return;
    // }
    try {
      handleNext();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
    }
  });

  // section3 submit
  const onSubmit3 = handleSubmitSection3(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar('Create success!');
      moveToView(masterModel);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
    }
  });

  const renderLoading = (
    <LoadingScreen
      sx={{
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    />
  );

  // Stepper start
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  // Render the step component based on the active step
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <FormProvider methods={methods} onSubmit={onSubmit1}>
              <Grid container spacing={3} sx={{ mt: 4 }}>
                <Grid xs={12} md={12}>
                  <Card sx={{ p: 3 }}>
                    <h3>Get Started:</h3>
                    <Box
                      rowGap={3}
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                      }}
                    >
                      <RHFTextField
                        key="CompanyName"
                        name="CompanyName"
                        label="Company Name"
                        value={vendorDetails[0]?.VenderName}
                        disabled
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />

                      <RHFTextField
                        key="Country"
                        name="Country"
                        label="Country"
                        value={surveyDetails[0]?.CountryName}
                        disabled
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />

                      <Controller
                        name="AssessmentDate"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <DesktopDatePicker
                            {...field}
                            key="AssessmentDate"
                            label="Assessment Date"
                            format="dd/MM/yyyy"
                            onChange={(newValue) => {
                              field.onChange(newValue);
                              // setMasterModel({
                              //   ...masterModel,
                              //   AssessmentDate: formatDate(newValue),
                              // });
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!error,
                                helperText: error?.message,
                              },
                            }}
                          />
                        )}
                      />

                      {/* <RHFAutocomplete
                        name="Country"
                        label="Country"
                        key="Country"
                        placeholder="Choose an option"
                        fullWidth
                        options={allCountries}
                        getOptionLabel={(option) => option?.CountryName || ''}
                        value={
                          allCountries.find(
                            (option) => option?.Country_id === values1?.Country?.Country_id
                          ) || null
                        }
                      /> */}

                      <RHFTextField key="RespondBy" name="RespondBy" label="Respond By" />
                      <RHFTextField key="JobTitle" name="JobTitle" label="Job Title" />
                    </Box>
                  </Card>
                  <Stack flexDirection="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                    <Button color="primary" type="submit" variant="contained">
                      Next
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </FormProvider>
          </>
        );
      case 1:
        return (
          <>
            <FormProvider methods={methods2} onSubmit={onSubmit2}>
              <Grid container spacing={3}>
                <Grid xs={12} md={12}>
                  <Card sx={{ p: 3, mt: 2 }}>
                    <h3>Cover Page:</h3>
                    <Box
                      rowGap={3}
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                      }}
                    >
                      <RHFTextField
                        InputLabelProps={{
                          shrink: true,
                        }}
                        key="SurveyNo"
                        name="SurveyNo"
                        label="Survey No."
                        value={surveyDetails[0]?.SurveyNo}
                        disabled
                      />
                      <RHFTextField
                        InputLabelProps={{
                          shrink: true,
                        }}
                        name="Context"
                        label="Survey Context"
                        value={surveyDetails[0]?.Context}
                        disabled
                      />
                      <RHFTextField
                        InputLabelProps={{
                          shrink: true,
                        }}
                        name="SurveyMarket"
                        label="Survey Market"
                        value={surveyDetails[0]?.CountryName}
                        disabled
                      />
                      <RHFTextField
                        InputLabelProps={{
                          shrink: true,
                        }}
                        key="Questionnaire"
                        name="Questionnaire"
                        label="Questionnaire"
                        value={surveyDetails[0]?.ProjectName}
                        disabled
                      />
                      <RHFTextField
                        InputLabelProps={{
                          shrink: true,
                        }}
                        key="TotalQuestions"
                        name="TotalQuestions"
                        label="Total No. of Questions"
                        value={totalQuestions}
                        disabled
                      />
                    </Box>
                  </Card>

                  <Stack flexDirection="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                    <LoadingButton
                      color="inherit"
                      type="button"
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </LoadingButton>
                    <LoadingButton
                      color="primary"
                      type="submit"
                      variant="contained"
                      isLoading={isSubmitting}
                    >
                      Next
                    </LoadingButton>
                  </Stack>
                </Grid>
              </Grid>
            </FormProvider>
          </>
        );
      case 2:
        return (
          <>
            {loading ? (
              renderLoading
            ) : (
              // <FormProvider methods={methods3} onSubmit={onSubmit3}>
              <Grid container spacing={3}>
                <Grid xs={12} md={12} mt={2}>
                  {/* <h3>Answer the following questions:</h3> */}
                  {/* <Box
                        rowGap={3}
                        columnGap={2}
                        display="grid"
                        gridTemplateColumns={{
                          xs: 'repeat(1, 1fr)',
                          sm: 'repeat(2, 1fr)',
                          md: 'repeat(3, 1fr)',
                        }}
                      >
                        <RHFTextField
                          InputLabelProps={{
                            shrink: true,
                          }}
                          name="ExporterCompanyName"
                          label="Exporter Company Name"
                          value={masterModel?.VenderName}
                          disabled
                        />
                        <RHFTextField
                          InputLabelProps={{
                            shrink: true,
                          }}
                          name="ExporterLegalAddress"
                          label="Exporter Legal Address"
                          value={masterModel?.Address1}
                          disabled
                        />
                        <RHFTextField
                          InputLabelProps={{
                            shrink: true,
                          }}
                          name="ExporterPhoneNumber"
                          label="Exporter Phone Number"
                          value={masterModel?.PhoneNumber}
                          disabled
                        />
                      </Box> */}
                  <QaPreviewNewEditForm
                    allQuestions={allQuestions}
                    mstData={mstData}
                    handleBack={handleBack}
                    InitationID={InitationID}
                  />
                </Grid>
              </Grid>
              // </FormProvider>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {
        <Card sx={{ my: 3, p: 2 }}>
          <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            Survey Form
          </Typography>
          <Grid container spacing={3} mt={3}>
            <Grid xs={12} md={12}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {/* Render step labels */}
                <Step>
                  <StepLabel>Get Started</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Cover Page</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Questions</StepLabel>
                </Step>
              </Stepper>

              {/* Render step content */}
              {loading ? renderLoading : renderStepContent(activeStep)}
            </Grid>
          </Grid>
        </Card>
      }
    </>
  );
  // Stepper end
}

SurveyFormSubmission.propTypes = {
  VID: PropTypes.any,
  SvNo: PropTypes.any,
  InitationID: PropTypes.any,
};

import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFAutocomplete,
  RHFTextField,
  RHFUploadBox,
} from 'src/components/hook-form';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormGroup,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { getDecryptedUserData } from 'src/utils/getUser';
import { Get, Post, Put } from 'src/utils/AxiosHelper';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { LoadingScreen } from 'src/components/loading-screen';
import { decrypt, encrypt } from 'src/api/encryption';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import { maxWidth, Stack } from '@mui/system';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

export default function QaPreviewNewEditForm({ allQuestions, mstData, handleBack, InitationID }) {
  const router = useRouter();
  const userData = getDecryptedUserData();
  const { enqueueSnackbar } = useSnackbar();

  const [uploadedFiles, setUploadedFiles] = useState({});

  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const generateValidationSchema = (allQuestions) => {
    const schema = {};

    allQuestions.forEach((questionGroup) => {
      questionGroup.Questions.forEach((question) => {
        const questionMstID = question.QuestionnaireMstID;

        if (question.QuestionType === '1') {
          // Required fields
          if (question.ChoiceType === 'Single Choice (Radio Buttons)') {
            schema[`Question${questionMstID}`] = Yup.string().required(`Please select an option`);
          } else if (question.ChoiceType === 'Multiple Choice (Checkboxes)') {
            schema[`Question${questionMstID}`] = Yup.array()
              .min(1, `Please select at least one option`)
              .required(`Please select at least one option`);
          } else if (question.ChoiceType === 'Date') {
            schema[`Question${questionMstID}`] = Yup.date()
              .required(`This question is required`)
              .typeError('Please enter a valid date');
          } else {
            schema[`Question${questionMstID}`] = Yup.string().required(`This question is required`);
          }

          // Add validation for file uploads if the selected choice has a FileType other than 'NA'
          if (question.ChoiceType === 'Single Choice (Radio Buttons)') {
            question.Choices.forEach((choice) => {
              if (
                choice.FileType === 'PDF' ||
                choice.FileType === 'Images' ||
                choice.FileType === 'URL'
              ) {
                schema[`QuestionFile${questionMstID}`] = Yup.mixed().test(
                  'file-required',
                  `File is required for ${choice.ChoiceText}`,
                  (value) => {
                    // Check if the choice is selected and if the file is uploaded
                    const selectedValues = values[`Question${questionMstID}`] || [];
                    if (selectedValues.includes(choice.QuestionnaireDtlID)) {
                      return !!value; // File is required if the choice is selected
                    }
                    return true; // No file required if the choice is not selected
                  }
                );
              }
            });
          }
          if (question.ChoiceType === 'Multiple Choice (Checkboxes)') {
            question.Choices.forEach((choice) => {
              if (
                choice.FileType === 'PDF' ||
                choice.FileType === 'Images' ||
                choice.FileType === 'URL'
              ) {
                schema[`QuestionFile${questionMstID}_${choice.QuestionnaireDtlID}`] =
                  Yup.mixed().test(
                    'file-required',
                    `File is required for ${choice.ChoiceText}`,
                    (value) => {
                      // Check if the choice is selected and if the file is uploaded
                      const selectedValues = values[`Question${questionMstID}`] || [];
                      if (selectedValues.includes(choice.QuestionnaireDtlID)) {
                        return !!value; // File is required if the choice is selected
                      }
                      return true; // No file required if the choice is not selected
                    }
                  );
              }
            });
          }
        }
      });
    });

    return Yup.object().shape(schema);
  };

  const NewQaPreviewSchema = generateValidationSchema(allQuestions);

  const defaultValues = useMemo(
    () => ({
      // Questionnaire: allQuestions?.Questionnaire || null,
    }),
    [allQuestions]
  );

  const methods = useForm({
    resolver: yupResolver(NewQaPreviewSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    unregister,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // Function to handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const insertDetails = async (SupplierAssessmentMstID, values, uploadedFiles, allQuestions) => {
    const updateStatusPayload = {
      InvitationID: encrypt(InitationID),
      SupplierID: encrypt(mstData?.SupplierID),
      StatusID: encrypt('3'), // 3 = responded
    };
    try {
      // Loop through all questions
      for (const questionGroup of allQuestions) {
        // Loop through each question in the Questions array
        for (const question of questionGroup.Questions) {
          const questionMstID = question.QuestionnaireMstID;

          // Handle single-choice questions (Text, Numeric, Date)
          if (
            question?.ChoiceType === 'Text' ||
            question?.ChoiceType === 'Numeric' ||
            question?.ChoiceType === 'Date'
          ) {
            const value = values[`Question${questionMstID}`];

            // For Text, Numeric, and Date questions, use the first choice's QuestionnaireDtlID
            const questionnaireDtlID = question.Choices[0]?.QuestionnaireDtlID;

            // Only proceed if questionnaireDtlID exists
            if (questionnaireDtlID) {
              // Skip if there's no value for the question
              if (value === undefined || value === null || value === '') {
                continue;
              }

              // Create a new FormData object
              const formData = new FormData();

              // Append fields to the FormData object
              formData.append('SupplierAssessmentMstID', SupplierAssessmentMstID);
              formData.append('QuestionnaireMstID', questionMstID);
              formData.append('QuestionnaireDtlID', questionnaireDtlID);
              formData.append('ResponseText', question.ChoiceType === 'Text' ? value : '');
              formData.append(
                'ResponseNumeric',
                question.ChoiceType === 'Numeric' ? parseFloat(value || 0) : ''
              );
              formData.append(
                'ResponseDate',
                question.ChoiceType === 'Date' ? format(value, 'yyyy-MM-dd') : ''
              );

              // Append the file if it exists
              const file = uploadedFiles[`QuestionFile${questionMstID}`];
              if (file) {
                formData.append('FileIfAny', file);
              }

              // Call the detail API for this question
              await Post('InsertSupplierAssessmentDetail', formData);
            }
          }

          // Handle single-choice questions (Radio Buttons)
          if (question?.ChoiceType === 'Single Choice (Radio Buttons)') {
            const value = values[`Question${questionMstID}`];

            // For Radio questions, use the selected choice's QuestionnaireDtlID
            const questionnaireDtlID = value; // The selected value is the QuestionnaireDtlID

            // Only proceed if questionnaireDtlID exists
            if (questionnaireDtlID) {
              // Create a new FormData object
              const formData = new FormData();

              // Append fields to the FormData object
              formData.append('SupplierAssessmentMstID', SupplierAssessmentMstID);
              formData.append('QuestionnaireMstID', questionMstID);
              formData.append('QuestionnaireDtlID', questionnaireDtlID);
              formData.append('ResponseText', ''); // No text response for Radio
              formData.append('ResponseNumeric', ''); // No numeric response for Radio
              formData.append('ResponseDate', ''); // No date response for Radio

              // Append the file if it exists
              const file = uploadedFiles[`QuestionFile${questionMstID}`];
              if (file) {
                formData.append('FileIfAny', file);
              }

              // Call the detail API for this question
              await Post('InsertSupplierAssessmentDetail', formData);
            }
          }

          // Handle multiple-choice questions (Checkboxes)
          if (question?.ChoiceType === 'Multiple Choice (Checkboxes)') {
            const selectedValues = values[`Question${questionMstID}`] || [];

            // Loop through each selected choice for checkboxes
            for (const choiceID of selectedValues) {
              // Only proceed if choiceID exists
              if (choiceID) {
                // Create a new FormData object
                const formData = new FormData();

                // Append fields to the FormData object
                formData.append('SupplierAssessmentMstID', SupplierAssessmentMstID);
                formData.append('QuestionnaireMstID', questionMstID);
                formData.append('QuestionnaireDtlID', choiceID); // Use the selected choice's ID
                formData.append('ResponseText', ''); // No text response for Checkboxes
                formData.append('ResponseNumeric', ''); // No numeric response for Checkboxes
                formData.append('ResponseDate', ''); // No date response for Checkboxes

                // Append the file if it exists
                const file = uploadedFiles[`QuestionFile${questionMstID}_${choiceID}`];
                if (file) {
                  formData.append('FileIfAny', file);
                }

                // Call the detail API for this choice
                await Post('InsertSupplierAssessmentDetail', formData);
              }
            }
          }
        }
      }

      console.log('All details inserted successfully');
      await Put(`UpdateSurveyInvitationStatus`, updateStatusPayload);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error inserting details:', error);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const encryptedMstData = Object.assign(
      {},
      ...Object.keys(mstData).map((key) => ({
        [key]: encrypt(mstData[key]),
      }))
    );
    try {
      const mstResponse = await Post('InsertSupplierAssessmentMst', encryptedMstData);
      if (mstResponse?.data?.ResponseCode === '100') {
        const SupplierAssessmentMstID = decrypt(
          mstResponse?.data?.ServiceRes[0]?.SupplierAssessmentMstID
        );

        await insertDetails(SupplierAssessmentMstID, values, uploadedFiles, allQuestions);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  });
  // Handle form submission errors (validation errors)
  const onError = (errors) => {
    enqueueSnackbar(
      'Please complete all mandatory fields and upload all required documents before submitting the form.',
      {
        variant: 'error',
        autoHideDuration: 6000, // Optional: Set the duration for which the snackbar is visible
      }
    );
  };

  const handleDrop = useCallback(
    (acceptedFiles, questionMstID) => {
      const file = acceptedFiles[0];

      if (file) {
        const newFile = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });

        setUploadedFiles((prev) => ({
          ...prev,
          [`QuestionFile${questionMstID}`]: newFile,
        }));

        setValue(`QuestionFile${questionMstID}`, newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = (questionIndex) => {
    setUploadedFiles((prev) => {
      const updatedFiles = { ...prev };
      delete updatedFiles[`QuestionFile${questionIndex}`];
      return updatedFiles;
    });

    setValue(`QuestionFile${questionIndex}`, undefined, { shouldValidate: true });
  };

  const handleRemoveFileWithDtl = (questionIndex, choiceID) => {
    setUploadedFiles((prev) => {
      const updatedFiles = { ...prev };
      delete updatedFiles[`QuestionFile${questionIndex}_${choiceID}`];
      return updatedFiles;
    });

    setValue(`QuestionFile${questionIndex}_${choiceID}`, undefined, { shouldValidate: true });
  };
  const renderLoading = <LoadingScreen sx={{ height: { xs: 200, md: 300 } }} />;
  let questionNumber = 0; // Global counter for question numbers

  return (
    <>
      {loading ? (
        renderLoading
      ) : (
        <FormProvider
          methods={methods}
          onSubmit={methods.handleSubmit(onSubmit, onError)} // Add onError here
        >
          <Grid container spacing={3}>
            <Grid xs={12} md={12}>
              <Box sx={{ mb: 2 }}>
                {allQuestions.length > 0 ? (
                  <Grid container spacing={3}>
                    {allQuestions.map((item, index) => (
                      <Grid key={index} item xs={12} md={12}>
                        <Card sx={{ p: 2, mb: 2, minWidth: 300 }}>
                          <Box sx={{ py: 2, borderBottom: '1px solid #e0e0e0' }}>
                            <Typography
                              variant="caption"
                              sx={{
                                my: { xs: 2, md: 0 },
                                mr: 1,
                                textAlign: 'left',
                                fontWeight: 700,
                                color: '#637381',

                                fontSize: 18,
                              }}
                            >
                              Title:
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                my: { xs: 2, md: 0 },
                                textAlign: 'left',
                                fontWeight: 700,
                                color: '#637381',
                                fontSize: 18,
                              }}
                            >
                              {item?.Title}
                            </Typography>
                          </Box>
                          {/* <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                my: { xs: 2, md: 0 },
                                mr: 1,
                                textAlign: 'left',
                                fontWeight: 700,
                                color: '#637381',

                                fontSize: 18,
                              }}
                            >
                              Questions in this section:
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                my: { xs: 2, md: 0 },
                                textAlign: 'left',
                                fontWeight: 700,
                                color: '#637381',
                                fontSize: 18,
                              }}
                            >
                              {item?.Questions?.length}
                            </Typography>
                          </Box> */}

                          {item?.Questions.map((question, index) => {
                            questionNumber++; // Increment the question number for each question
                            let selectedChoice;
                            if (question?.MaxChoices === '') {
                              selectedChoice = question?.Choices[0];
                            } else {
                              selectedChoice = question?.Choices.find(
                                (choice) =>
                                  choice?.QuestionnaireDtlID ===
                                  values[`Question${question?.QuestionnaireMstID}`]
                              );
                            }

                            return (
                              <Grid key={index} item xs={12} md={12} sx={{ px: 0 }}>
                                <Typography variant="body1" sx={{ color: '#005CA9' }}>
                                  Q{questionNumber}. {question?.Question}{' '}
                                  {question?.QuestionType === '1' && (
                                    <span style={{ color: 'red' }}>*</span>
                                  )}
                                  {/* Display the question number */}
                                  <Tooltip
                                    title={`Instructions: ${question?.Guide}` || ''}
                                    placement="top"
                                  >
                                    <IconButton>
                                      <Iconify
                                        icon="mingcute:question-fill"
                                        width={20}
                                        height={20}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                </Typography>

                                {question?.ChoiceType === 'Text' && (
                                  <RHFTextField
                                    name={`Question${question?.QuestionnaireMstID}`}
                                    placeholder="Type here..."
                                    // error={
                                    //   !!methods.formState.errors[
                                    //     `Question${question?.QuestionnaireMstID}`
                                    //   ]
                                    // }
                                    // helperText={
                                    //   methods.formState.errors[
                                    //     `Question${question?.QuestionnaireMstID}`
                                    //   ]?.message
                                    // }
                                  />
                                )}

                                {question?.ChoiceType === 'Numeric' && (
                                  <RHFTextField
                                    name={`Question${question?.QuestionnaireMstID}`}
                                    placeholder="0"
                                    type="number"
                                    sx={{ maxWidth: 300 }}
                                    error={
                                      !!methods.formState.errors[
                                        `Question${question?.QuestionnaireMstID}`
                                      ]
                                    }
                                    helperText={
                                      methods.formState.errors[
                                        `Question${question?.QuestionnaireMstID}`
                                      ]?.message
                                    }
                                  />
                                )}

                                {question?.ChoiceType === 'Date' && (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <Controller
                                      name={`Question${question?.QuestionnaireMstID}`}
                                      control={control}
                                      render={({ field, fieldState: { error } }) => (
                                        <DesktopDatePicker
                                          sx={{
                                            maxWidth: 300,
                                            borderColor:
                                              !!methods.formState.errors[
                                                `Question${question?.QuestionnaireMstID}`
                                              ] && 'red',
                                          }}
                                          format="dd/MM/yyyy"
                                          value={field.value}
                                          onChange={(newValue) => field.onChange(newValue)}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              error={!!error} // Explicitly pass the error state
                                              helperText={error?.message} // Explicitly pass the error message
                                              sx={{
                                                '& .MuiOutlinedInput-root': {
                                                  '&.Mui-error fieldset': {
                                                    borderColor: 'red', // Ensure border turns red on error
                                                  },
                                                },
                                              }}
                                            />
                                          )}
                                        />
                                      )}
                                    />
                                    <Typography color="error" variant="caption" sx={{ pl: 2 }}>
                                      {
                                        methods.formState.errors[
                                          `Question${question?.QuestionnaireMstID}`
                                        ]?.message
                                      }
                                    </Typography>
                                  </Box>
                                )}

                                {question?.ChoiceType === 'Single Choice (Radio Buttons)' && (
                                  <>
                                    <RadioGroup
                                      row
                                      value={values[`Question${question?.QuestionnaireMstID}`]}
                                      aria-labelledby="demo-radio-buttons-group-label"
                                      name="radio-buttons-group"
                                      onChange={(e) => {
                                        setValue(
                                          `Question${question?.QuestionnaireMstID}`,
                                          e.target.value
                                        );
                                      }}
                                      sx={{ pl: 2 }}
                                    >
                                      {question?.Choices.map((choice, index) => (
                                        <FormControlLabel
                                          key={index}
                                          value={choice?.QuestionnaireDtlID}
                                          control={<Radio />}
                                          label={choice?.ChoiceText}
                                        />
                                      ))}
                                    </RadioGroup>
                                    {methods.formState.errors[
                                      `Question${question?.QuestionnaireMstID}`
                                    ] && (
                                      <Typography variant="caption" color="error" sx={{ pl: 2 }}>
                                        {
                                          methods.formState.errors[
                                            `Question${question?.QuestionnaireMstID}`
                                          ]?.message
                                        }
                                      </Typography>
                                    )}

                                    {/* Render upload box for selected choice */}
                                    {question?.Choices.map((choice) => {
                                      if (
                                        (choice.FileType === 'PDF' ||
                                          choice.FileType === 'Images' ||
                                          choice.FileType === 'URL') &&
                                        values[`Question${question?.QuestionnaireMstID}`] ===
                                          choice.QuestionnaireDtlID
                                      ) {
                                        return (
                                          <Box key={choice.QuestionnaireDtlID} sx={{ mt: 2 }}>
                                            <RHFUploadBox
                                              name={`QuestionFile${question?.QuestionnaireMstID}`}
                                              accept={
                                                choice.FileType === 'PDF'
                                                  ? { 'application/pdf': ['.pdf'] }
                                                  : { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }
                                              }
                                              onDrop={(acceptedFiles) =>
                                                handleDrop(
                                                  acceptedFiles,
                                                  `${question?.QuestionnaireMstID}`
                                                )
                                              }
                                              file={
                                                uploadedFiles[
                                                  `QuestionFile${question?.QuestionnaireMstID}`
                                                ]
                                              }
                                              error={
                                                !!methods.formState.errors[
                                                  `QuestionFile${question?.QuestionnaireMstID}`
                                                ]
                                              }
                                              helperText={
                                                methods.formState.errors[
                                                  `QuestionFile${question?.QuestionnaireMstID}`
                                                ]?.message
                                              }
                                            />
                                            {uploadedFiles[
                                              `QuestionFile${question?.QuestionnaireMstID}`
                                            ] && (
                                              <>
                                                <Typography
                                                  variant="caption"
                                                  sx={{ color: 'green' }}
                                                >
                                                  {
                                                    uploadedFiles[
                                                      `QuestionFile${question?.QuestionnaireMstID}`
                                                    ]?.name
                                                  }
                                                </Typography>
                                                <IconButton
                                                  onClick={() =>
                                                    handleRemoveFile(question?.QuestionnaireMstID)
                                                  }
                                                >
                                                  <Iconify
                                                    icon="mdi:close-circle"
                                                    width={24}
                                                    height={24}
                                                  />
                                                </IconButton>
                                              </>
                                            )}
                                          </Box>
                                        );
                                      }
                                      return null;
                                    })}
                                  </>
                                )}

                                {/* {selectedChoice &&
                                  (selectedChoice?.FileType === 'PDF' ? (
                                    <Box
                                      sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}
                                    >
                                      <RHFUploadBox
                                        name={`QuestionFile${question?.QuestionnaireMstID}`}
                                        accept={{ 'application/pdf': ['.pdf'] }}
                                        onDrop={(acceptedFiles) =>
                                          handleDrop(acceptedFiles, question?.QuestionnaireMstID)
                                        }
                                        file={
                                          uploadedFiles[
                                            `QuestionFile${question?.QuestionnaireMstID}`
                                          ]
                                        }
                                        error={
                                          !!methods.formState.errors[
                                            `QuestionFile${question?.QuestionnaireMstID}`
                                          ]
                                        }
                                        helperText={
                                          methods.formState.errors[
                                            `QuestionFile${question?.QuestionnaireMstID}`
                                          ]?.message
                                        }
                                      />
                                      {uploadedFiles[
                                        `QuestionFile${question?.QuestionnaireMstID}`
                                      ] && (
                                        <>
                                          <Typography variant="caption" sx={{ color: 'green' }}>
                                            {
                                              uploadedFiles[
                                                `QuestionFile${question?.QuestionnaireMstID}`
                                              ]?.name
                                            }
                                          </Typography>
                                          <IconButton
                                            onClick={() =>
                                              handleRemoveFile(question?.QuestionnaireMstID)
                                            }
                                          >
                                            <Iconify
                                              icon="mdi:close-circle"
                                              width={24}
                                              height={24}
                                            />
                                          </IconButton>
                                        </>
                                      )}
                                    </Box>
                                  ) : selectedChoice?.FileType === 'Images' ? (
                                    <Box
                                      sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}
                                    >
                                      <RHFUploadBox
                                        name={`QuestionFile${question?.QuestionnaireMstID}`}
                                        accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}
                                        onDrop={(acceptedFiles) =>
                                          handleDrop(acceptedFiles, question?.QuestionnaireMstID)
                                        }
                                        file={
                                          uploadedFiles[
                                            `QuestionFile${question?.QuestionnaireMstID}`
                                          ]
                                        }
                                        error={
                                          !!methods.formState.errors[
                                            `QuestionFile${question?.QuestionnaireMstID}`
                                          ]
                                        }
                                        helperText={
                                          methods.formState.errors[
                                            `QuestionFile${question?.QuestionnaireMstID}`
                                          ]?.message
                                        }
                                      />
                                    </Box>
                                  ) : selectedChoice?.FileType === 'URL' ? (
                                    <RHFTextField
                                      name={`QuestionURL${question?.QuestionnaireMstID}`}
                                      placeholder="Enter URL here..."
                                    />
                                  ) : null)} */}

                                {question?.ChoiceType === 'Multiple Choice (Checkboxes)' && (
                                  <>
                                    <FormGroup>
                                      {question?.Choices.map((choice, index) => {
                                        const questionKey = `Question${question?.QuestionnaireMstID}`;
                                        const selectedValues = values[questionKey] || [];

                                        return (
                                          <FormControlLabel
                                            key={index}
                                            control={
                                              <Checkbox
                                                checked={selectedValues.includes(
                                                  choice?.QuestionnaireDtlID
                                                )}
                                                onChange={(e) => {
                                                  let newSelectedValues = [...selectedValues];
                                                  if (e.target.checked) {
                                                    newSelectedValues.push(
                                                      choice?.QuestionnaireDtlID
                                                    );
                                                  } else {
                                                    newSelectedValues = newSelectedValues.filter(
                                                      (id) => id !== choice?.QuestionnaireDtlID
                                                    );
                                                  }
                                                  setValue(questionKey, newSelectedValues);
                                                }}
                                              />
                                            }
                                            label={choice?.ChoiceText}
                                          />
                                        );
                                      })}
                                    </FormGroup>
                                    {methods.formState.errors[
                                      `Question${question?.QuestionnaireMstID}`
                                    ] && (
                                      <Typography variant="caption" color="error">
                                        {
                                          methods.formState.errors[
                                            `Question${question?.QuestionnaireMstID}`
                                          ]?.message
                                        }
                                      </Typography>
                                    )}

                                    {/* Render upload boxes for selected choices */}
                                    {question?.Choices.map((choice) => {
                                      if (
                                        (choice.FileType === 'PDF' ||
                                          choice.FileType === 'Images' ||
                                          choice.FileType === 'URL') &&
                                        values[`Question${question?.QuestionnaireMstID}`]?.includes(
                                          choice.QuestionnaireDtlID
                                        )
                                      ) {
                                        return (
                                          <Box key={choice.QuestionnaireDtlID} sx={{ mt: 2 }}>
                                            <RHFUploadBox
                                              name={`QuestionFile${question?.QuestionnaireMstID}_${choice.QuestionnaireDtlID}`}
                                              accept={
                                                choice.FileType === 'PDF'
                                                  ? { 'application/pdf': ['.pdf'] }
                                                  : { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }
                                              }
                                              onDrop={(acceptedFiles) =>
                                                handleDrop(
                                                  acceptedFiles,
                                                  `${question?.QuestionnaireMstID}_${choice.QuestionnaireDtlID}`
                                                )
                                              }
                                              file={
                                                uploadedFiles[
                                                  `QuestionFile${question?.QuestionnaireMstID}_${choice.QuestionnaireDtlID}`
                                                ]
                                              }
                                              error={
                                                !!methods.formState.errors[
                                                  `QuestionFile${question?.QuestionnaireMstID}_${choice.QuestionnaireDtlID}`
                                                ]
                                              }
                                              helperText={
                                                methods.formState.errors[
                                                  `QuestionFile${question?.QuestionnaireMstID}_${choice.QuestionnaireDtlID}`
                                                ]?.message
                                              }
                                            />
                                            {uploadedFiles[
                                              `QuestionFile${question?.QuestionnaireMstID}_${choice.QuestionnaireDtlID}`
                                            ] && (
                                              <Box
                                                sx={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  gap: 1,
                                                }}
                                              >
                                                <Typography
                                                  variant="caption"
                                                  color="green"
                                                  sx={{ mt: 1 }}
                                                >
                                                  {
                                                    uploadedFiles[
                                                      `QuestionFile${question?.QuestionnaireMstID}_${choice.QuestionnaireDtlID}`
                                                    ]?.name
                                                  }
                                                </Typography>
                                                <IconButton
                                                  onClick={() =>
                                                    handleRemoveFileWithDtl(
                                                      question?.QuestionnaireMstID,
                                                      choice.QuestionnaireDtlID
                                                    )
                                                  }
                                                >
                                                  <Iconify
                                                    icon="mdi:close-circle"
                                                    width={24}
                                                    height={24}
                                                  />
                                                </IconButton>
                                              </Box>
                                            )}
                                          </Box>
                                        );
                                      }
                                      return null;
                                    })}
                                  </>
                                )}
                              </Grid>
                            );
                          })}
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    No Questions in this survey
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
          <Stack flexDirection="row" justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <LoadingButton color="primary" type="submit" variant="contained" loading={isSubmitting}>
              Submit Form
            </LoadingButton>
          </Stack>
        </FormProvider>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Submission Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Thank you a lot for your submission. It is safe to close your browser now.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

QaPreviewNewEditForm.propTypes = {
  allQuestions: PropTypes.any,
  mstData: PropTypes.object,
  InitationID: PropTypes.any,
};

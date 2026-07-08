import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  Link,
  IconButton,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from 'src/components/iconify';
import { fDate } from 'src/utils/format-time';
import Label from 'src/components/label';
import { border } from '@mui/system';
import { getDecryptedUserData } from 'src/utils/getUser';
import { Post } from 'src/utils/AxiosHelper';
import { encrypt } from 'src/api/encryption';
import { useRouter } from 'next/navigation';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function QaPreviewNewEditResultForm({ allQuestions, mstData, marksData }) {
  const userData = getDecryptedUserData();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  // Dynamically generate the Yup schema based on the questions
  const marksSchema = Yup.object().shape(
    allQuestions.reduce((schema, questionGroup) => {
      questionGroup.Questions.forEach((question) => {
        schema[`Marks${question.QuestionnaireMstID}`] = Yup.number()
          .required('Marks are required')
          .min(0, 'Marks cannot be negative')
          .typeError('Marks must be a number');
      });
      return schema;
    }, {})
  );

  // Set default values for marks fields from marksData
  const defaultValues = useMemo(() => {
    const values = {};
    marksData.forEach((mark) => {
      values[`Marks${mark.QuestionnaireMstID}`] = parseFloat(mark.Marks); // Convert string to number
    });
    return values;
  }, [marksData]);

  const methods = useForm({
    resolver: yupResolver(marksSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const marksPayload = allQuestions?.flatMap((questionGroup) =>
        questionGroup.Questions.map((question) => ({
          SupplierAssessmentMstID: mstData?.SupplierAssessmentMstID,
          QuestionnaireMstID: question.QuestionnaireMstID,
          Marks: data[`Marks${question.QuestionnaireMstID}`].toFixed(2),
          TotalQuestions: mstData?.TotalQuestions,
          TotalMandatory: mstData?.TotalMandatory,
          TotalOptional: mstData?.TotalOptional,
          TotalAttempted: mstData?.TotalAttempted,
          UserID: userData[0]?.UserID,
        }))
      );
      const encryptedDetails = marksPayload?.map((X) =>
        Object.assign(
          {},
          ...Object.keys(X).map((key) => ({
            [key]: encrypt(X[key]),
          }))
        )
      );
      // Assuming you have an API endpoint to submit marks
      const response = await Post('InsertSupplierAssessmentMarks', encryptedDetails);

      if (response?.data?.ResponseCode === '100') {
        enqueueSnackbar('Marks Updated successfully', { variant: 'success' });
        router.push(paths.dashboard.RiskAnalysis.RiskMitigation.inviteParticipant.root);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  });

  let questionNumber = 0;
  return (
    <>
      {loading ? (
        <LoadingScreen sx={{ height: { xs: 200, md: 300 } }} />
      ) : (
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid xs={12} md={12}>
              <Box sx={{ mb: 2 }}>
                <Card sx={{ p: 2, mb: 2 }}>
                  <Box
                    rowGap={3}
                    columnGap={{ sm: 10, md: 50 }}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                      // md: 'repeat(3, 1fr)',
                    }}
                  >
                    <Box>
                      <Box>
                        <Typography variant="caption" fontWeight={600} fontSize={14}>
                          Company Name:
                        </Typography>
                        <Typography variant="caption" fontSize={14} sx={{ ml: 2 }}>
                          {mstData.CompanyName}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight={600} fontSize={14}>
                          Responded By:
                        </Typography>
                        <Typography variant="caption" fontSize={14} sx={{ ml: 2 }}>
                          {mstData?.RespondBy}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight={600} fontSize={14}>
                          Job Title:
                        </Typography>
                        <Typography variant="caption" fontSize={14} sx={{ ml: 2 }}>
                          {mstData?.JobTitle}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight={600} fontSize={14}>
                          Country:
                        </Typography>
                        <Typography variant="caption" fontSize={14} sx={{ ml: 2 }}>
                          {mstData?.CountryName}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight={600} fontSize={14}>
                          Assessment Date:
                        </Typography>
                        <Typography variant="caption" fontSize={14} sx={{ ml: 2 }}>
                          {fDate(mstData?.AssessmentDate)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Box>
                        <Typography variant="caption" fontWeight={600} fontSize={14}>
                          Total Questions:
                        </Typography>
                        <Typography variant="caption" fontSize={14} sx={{ ml: 2 }}>
                          {mstData?.TotalQuestions}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight={600} fontSize={14}>
                          Mandatory:
                        </Typography>
                        <Typography variant="caption" fontSize={14} sx={{ ml: 2 }}>
                          {mstData?.TotalMandatory}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight={600} fontSize={14}>
                          Optional:
                        </Typography>
                        <Typography variant="caption" fontSize={14} sx={{ ml: 2 }}>
                          {mstData?.TotalOptional}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight={600} fontSize={14}>
                          Attempted:
                        </Typography>
                        <Typography variant="caption" fontSize={14} sx={{ ml: 2 }}>
                          {mstData?.TotalAttempted}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight={600} fontSize={14}>
                          Total Obtained Marks:
                        </Typography>
                        <Typography variant="caption" fontSize={14} sx={{ ml: 2 }}>
                          {marksData?.reduce((sum, mark) => {
                            return sum + parseFloat(mark?.Marks); // Convert string to number and add to sum
                          }, 0) || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Card>

                {allQuestions.length > 0 ? (
                  <Grid container spacing={3}>
                    {allQuestions.map((item, index) => (
                      <Grid key={index} item xs={12} md={12}>
                        <Card sx={{ p: 2, minWidth: 300 }}>
                          <Box sx={{ py: 2, borderBottom: '1px solid #e0e0e0' }}>
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 700, color: '#637381', fontSize: 18 }}
                            >
                              Title: {item?.Title}
                            </Typography>
                          </Box>

                          {item?.Questions.map((question, index) => {
                            questionNumber++;
                            return (
                              <Grid key={index} item xs={12} md={12} sx={{ px: 0 }}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Typography variant="body1" sx={{}}>
                                    Q{questionNumber}. {question?.Question}&nbsp;
                                    {question?.QuestionType === '1' && (
                                      <span style={{ color: 'red' }}>*</span>
                                    )}
                                  </Typography>
                                  <RHFTextField
                                    name={`Marks${question?.QuestionnaireMstID}`}
                                    label="Marks"
                                    type="number"
                                    sx={{ maxWidth: 100, mb: 2 }}
                                  />
                                </Box>

                                {question?.ChoiceType === 'Text' && (
                                  <Typography variant="body1" fontWeight={600}>
                                    Ans:{' '}
                                    {question?.AttemptStatus === 'Not Attempted' ? (
                                      <span style={{ color: 'red' }}>Not Attempted</span>
                                    ) : (
                                      question?.Choices[0]?.ResponseText
                                    )}
                                  </Typography>
                                )}

                                {question?.ChoiceType === 'Numeric' && (
                                  <Typography variant="body1" fontWeight={600}>
                                    Ans:{' '}
                                    {question?.AttemptStatus === 'Not Attempted' ? (
                                      <span style={{ color: 'red' }}>Not Attempted</span>
                                    ) : (
                                      parseFloat(question?.Choices[0]?.ResponseNumeric || '0')
                                    )}
                                  </Typography>
                                )}

                                {question?.ChoiceType === 'Date' && (
                                  <Typography variant="body1" fontWeight={600}>
                                    Ans:{' '}
                                    {question?.AttemptStatus === 'Not Attempted' ? (
                                      <span style={{ color: 'red' }}>Not Attempted</span>
                                    ) : (
                                      fDate(new Date(question?.Choices[0]?.ResponseDate))
                                    )}
                                  </Typography>
                                )}
                                {question?.ChoiceType === 'Single Choice (Radio Buttons)' && (
                                  <>
                                    <Typography variant="body1" fontWeight={600}>
                                      Ans:&nbsp;
                                      {question?.AttemptStatus === 'Not Attempted' ? (
                                        <span style={{ color: 'red' }}>Not Attempted</span>
                                      ) : (
                                        question?.Choices?.map(
                                          (choice, index) => choice?.ChoiceText
                                        )
                                      )}
                                    </Typography>
                                  </>
                                )}

                                {question?.ChoiceType === 'Multiple Choice (Checkboxes)' && (
                                  <>
                                    <Typography variant="body1" fontWeight={600}>
                                      Ans:&nbsp;
                                      {question?.AttemptStatus === 'Not Attempted' ? (
                                        <span style={{ color: 'red' }}>Not Attempted</span>
                                      ) : null}
                                    </Typography>
                                    {question?.AttemptStatus !== 'Not Attempted' && (
                                      <FormGroup sx={{ ml: 2 }}>
                                        {question?.Choices.map((choice, index) => (
                                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <FormControlLabel
                                              key={index}
                                              sx={{ cursor: 'default', mt: 1 }}
                                              control={
                                                <Checkbox
                                                  checked
                                                  color="default"
                                                  sx={{ cursor: 'default' }}
                                                />
                                              }
                                              label={choice?.ChoiceText}
                                            />
                                            {choice?.FileType === 'PDF' ? (
                                              <Link
                                                href={choice?.FileURL}
                                                target="_blank"
                                                sx={{
                                                  mt: 1,
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  textDecoration: 'none',
                                                }}
                                              >
                                                <Label
                                                  sx={{ p: 2 }}
                                                  startIcon={
                                                    <Iconify
                                                      icon="uiw:file-pdf"
                                                      width={16}
                                                      height={16}
                                                    />
                                                  }
                                                >
                                                  View File
                                                </Label>
                                              </Link>
                                            ) : choice?.FileType === 'Images' ? (
                                              <Link
                                                href={choice?.FileURL}
                                                target="_blank"
                                                sx={{
                                                  mt: 1,
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  textDecoration: 'none',
                                                }}
                                              >
                                                <Label
                                                  startIcon={
                                                    <Iconify
                                                      icon="majesticons:image-line"
                                                      width={16}
                                                      height={16}
                                                    />
                                                  }
                                                >
                                                  View Image
                                                </Label>
                                              </Link>
                                            ) : choice?.FileType === 'URL' ? (
                                              <Link
                                                href={choice?.FileURL}
                                                target="_blank"
                                                sx={{
                                                  mt: 1,
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  textDecoration: 'none',
                                                }}
                                              >
                                                <Label
                                                  startIcon={
                                                    <Iconify
                                                      icon="entypo:link"
                                                      width={16}
                                                      height={16}
                                                    />
                                                  }
                                                >
                                                  Link
                                                </Label>
                                              </Link>
                                            ) : null}
                                          </Box>
                                        ))}
                                      </FormGroup>
                                    )}
                                  </>
                                )}

                                {question?.ChoiceType === 'Multiple Choice (Checkboxes)'
                                  ? null
                                  : question?.Choices.map((choice) => {
                                      if (choice?.FileType === 'PDF') {
                                        return (
                                          <Link
                                            href={choice?.FileURL}
                                            sx={{ ml: 2 }}
                                            target="_blank"
                                            key={choice?.QuestionnaireDtlID}
                                          >
                                            <Label
                                              startIcon={<Iconify icon="uiw:file-pdf" />}
                                              sx={{ mt: 2, p: 2, cursor: 'pointer' }}
                                            >
                                              View File
                                            </Label>
                                          </Link>
                                        );
                                      } else if (choice?.FileType === 'Images') {
                                        return (
                                          <Link
                                            href={choice?.FileURL}
                                            target="_blank"
                                            key={choice?.QuestionnaireDtlID}
                                          >
                                            <Label
                                              startIcon={<Iconify icon="majesticons:image-line" />}
                                              sx={{ mt: 2, p: 2, cursor: 'pointer' }}
                                            >
                                              View Image
                                            </Label>
                                          </Link>
                                        );
                                      } else if (choice?.FileType === 'URL') {
                                        return (
                                          <Link
                                            href={choice?.FileURL}
                                            target="_blank"
                                            key={choice?.QuestionnaireDtlID}
                                          >
                                            <Label
                                              startIcon={<Iconify icon="entypo:link" />}
                                              sx={{ mt: 2, p: 2, cursor: 'pointer' }}
                                            >
                                              Open Link
                                            </Label>
                                          </Link>
                                        );
                                      }
                                      return null;
                                    })}
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
            <LoadingButton color="primary" type="submit" variant="contained" loading={isSubmitting}>
              Save Marks
            </LoadingButton>
          </Stack>
        </FormProvider>
      )}
    </>
  );
}

QaPreviewNewEditResultForm.propTypes = {
  allQuestions: PropTypes.any,
  mstData: PropTypes.object,
  marksData: PropTypes.array,
};

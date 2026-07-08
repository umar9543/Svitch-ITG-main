'use strict';

import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
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

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFCheckbox,
} from 'src/components/hook-form';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import Scrollbar from 'src/components/scrollbar';
import {
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { getDecryptedUserData } from 'src/utils/getUser';
import { Delete, Get, Post, Put } from 'src/utils/AxiosHelper';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { LoadingScreen } from 'src/components/loading-screen';
import { decrypt, encrypt } from 'src/api/encryption';

// ----------------------------------------------------------------------

export default function QaQuestionariesNewEditForm({
  allQuestionnaires,
  setAllQuestionnaires,
  currentQuestions,
  slug,
}) {
  const router = useRouter();
  const userData = getDecryptedUserData();
  const { enqueueSnackbar } = useSnackbar();

  // <Card sx={{ p: 2, mb: 2 }}>
  //                 <Box
  //                   rowGap={3}
  //                   columnGap={2}
  //                   display="grid"
  //                   gridTemplateColumns={{
  //                     xs: 'repeat(1, 1fr)',
  //                     sm: 'repeat(2, 1fr)',
  //                     // md: 'repeat(3, 1fr)',
  //                   }}
  //                 >
  //                   <Box>
  //                     <Box>
  //                       <Typography variant="caption" fontWeight={600} fontSize={14}>
  //                         Company name:
  //                       </Typography>
  //                       <Typography variant="caption" fontSize={14} sx={{ ml: 2 }}>
  //                         ITG
  //                       </Typography>
  //                     </Box>
  //                     <Box>
  //                       <Typography variant="caption" fontWeight={600} fontSize={14}>
  //                         Responded By:
  //                       </Typography>
  //                       <Typography variant="caption" fontSize={14} sx={{ ml: 2 }}>
  //                         Hasham
  //                       </Typography>
  //                     </Box>
  //                     <Box>
  //                       <Typography variant="caption" fontWeight={600} fontSize={14}>
  //                         Country:
  //                       </Typography>
  //                       <Typography variant="caption" fontSize={14} sx={{ ml: 2 }}>
  //                         USA
  //                       </Typography>
  //                     </Box>
  //                     <Box>
  //                       <Typography variant="caption" fontWeight={600} fontSize={14}>
  //                         Assessment Date:
  //                       </Typography>
  //                       <Typography variant="caption" fontSize={14} sx={{ ml: 2 }}>
  //                         11-Mar-2025
  //                       </Typography>
  //                     </Box>
  //                   </Box>
  //                   <Box>
  //                     <Box>
  //                       <Typography variant="caption" fontWeight={600} fontSize={14}>
  //                         Total questions:
  //                       </Typography>
  //                       <Typography variant="caption" fontSize={14} sx={{ ml: 2 }}>
  //                         3
  //                       </Typography>
  //                     </Box>
  //                     <Box>
  //                       <Typography variant="caption" fontWeight={600} fontSize={14}>
  //                         Mandatory:
  //                       </Typography>
  //                       <Typography variant="caption" fontSize={14} sx={{ ml: 2 }}>
  //                         3
  //                       </Typography>
  //                     </Box>
  //                     <Box>
  //                       <Typography variant="caption" fontWeight={600} fontSize={14}>
  //                         Optional:
  //                       </Typography>
  //                       <Typography variant="caption" fontSize={14} sx={{ ml: 2 }}>
  //                         0
  //                       </Typography>
  //                     </Box>
  //                     <Box>
  //                       <Typography variant="caption" fontWeight={600} fontSize={14}>
  //                         Attempted:
  //                       </Typography>
  //                       <Typography variant="caption" fontSize={14} sx={{ ml: 2 }}>
  //                         3
  //                       </Typography>
  //                     </Box>
  //                   </Box>
  //                   {/* <Box/> */}
  //                   {/* <RHFTextField
  //                     label="Total Questions"
  //                     name="totalQuestions"
  //                     value={3}
  //                     disabled
  //                     InputLabelProps={{
  //                       shrink: true,
  //                     }}/>
  //                     <RHFTextField
  //                     label="Mandatory Questions"
  //                     name="totalQuestions"
  //                     value={3}
  //                     disabled
  //                     InputLabelProps={{
  //                       shrink: true,
  //                     }}/>
  //                     <RHFTextField
  //                     label="Optional Questions"
  //                     name="totalQuestions"
  //                     value={3}
  //                     disabled
  //                     InputLabelProps={{
  //                       shrink: true,
  //                     }}/>
  //                     <RHFTextField
  //                     label="Attempted Questions"
  //                     name="totalQuestions"
  //                     value={3}
  //                     disabled
  //                     InputLabelProps={{
  //                       shrink: true,
  //                     }}/> */}
  //                 </Box>
  //               </Card>

  const [customerList, setCustomerList] = useState([]);
  const [answerChoice, setAnswerChoice] = useState([]);
  const [noOfChoices, setNoOfChoices] = useState([]);
  const [questionFileTypes, setQuestionFileTypes] = useState([]);

  const [selectedQuestTypes, setSelectedQuestTypes] = useState({});

  const [loading, setLoading] = useState(true);

  const FetchCustomerList = async () => {
    const response = await Get(`GetFilteredDataCustomer?UserID=${userData[0]?.UserID}`);
    const decryptedData = decryptObjectKeys(response?.data?.ServiceRes);
    setCustomerList(decryptedData);
  };

  const GetAnswerChoices = async () => {
    const response = await Get(`GetAnswerChoices`);
    const decryptedData = decryptObjectKeys(response?.data?.ServiceRes);
    const sortedData = decryptedData.sort((a, b) => Number(a.ChoiceID) - Number(b.ChoiceID));

    setAnswerChoice(sortedData);
  };

  const GetChoiceOptions = async () => {
    const response = await Get(`GetChoiceOptions`);
    const decryptedData = decryptObjectKeys(response?.data?.ServiceRes);
    setNoOfChoices(decryptedData);
  };

  const GetQuestionFileTypes = async () => {
    const response = await Get(`GetQuestionFileTypes`);
    const decryptedData = decryptObjectKeys(response?.data?.ServiceRes);
    const sortedData = decryptedData.sort((a, b) => Number(a.FileTypeID) - Number(b.FileTypeID));
    setQuestionFileTypes(sortedData);
  };

  useEffect(() => {
    const fetchData = async () => {
      Promise.all([
        GetAnswerChoices(),
        GetChoiceOptions(),
        FetchCustomerList(),
        GetQuestionFileTypes(),
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const NewQaQuestionariesSchema = Yup.object().shape({
    Questionnaire: Yup.object().required('Questionnaire is required'),
    Title: Yup.string().required('Title is required'),
    GuideInstruction: Yup.string().required('Guide/Instruction is required'),
    Question: Yup.string().required('Question is required'),
    AnswerBuilder: Yup.object().required('Answer Builder is required'),
  });

  const defaultValues = useMemo(
    () => ({
      Questionnaire: currentQuestions?.Questionnaire || null,
      Title: currentQuestions?.Title || '',
      GuideInstruction: currentQuestions?.GuideInstruction || '',
      Question: currentQuestions?.Question || '',
      AnswerBuilder: currentQuestions?.AnswerBuilder || null,
      IsMandatory: currentQuestions?.QuestionType === '0' ? false : true,
      noOfChoices: currentQuestions?.noOfChoices || null,
      ...currentQuestions?.Choices?.reduce((acc, choice, index) => {
        acc[`Choice${index + 1}`] = choice.ChoiceText;
        return acc;
      }, {}),
    }),
    [currentQuestions]
  );

  const methods = useForm({
    resolver: yupResolver(NewQaQuestionariesSchema),
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

  useEffect(() => {
    if (currentQuestions) {
      setValue('Questionnaire', currentQuestions?.Questionnaire || null);
      setValue('Title', currentQuestions?.Title || '');
      setValue('GuideInstruction', currentQuestions?.GuideInstruction || '');
      setValue('Question', currentQuestions?.Question || '');
      setValue('IsMandatory', currentQuestions?.QuestionType === '0' ? false : true);
      setValue('AnswerBuilder', currentQuestions?.AnswerBuilder || null);
      setValue('noOfChoices', currentQuestions?.noOfChoices || null);

      currentQuestions?.Choices?.forEach((choice, index) => {
        setValue(`Choice${index + 1}`, choice?.ChoiceText);
        setSelectedQuestTypes((prev) => ({
          ...prev,
          [index + 1]: choice.FileTypeID,
        }));
      });
    }
  }, [currentQuestions, setValue]);

  useEffect(() => {
    if (currentQuestions) {
      currentQuestions?.Choices?.forEach((choice, index) => {
        setValue(`Choice${index + 1}`, choice?.ChoiceText);
        setSelectedQuestTypes((prev) => ({
          ...prev,
          [index + 1]: choice.FileTypeID,
        }));
      });
    }
  }, [values?.noOfChoices, currentQuestions]);

  const answerBuilderChoiceID = watch('AnswerBuilder')?.ChoiceID;

  useEffect(() => {
    if (currentQuestions?.AnswerBuilder) {
      setValue(
        'AnswerBuilder',
        answerChoice.find(
          (option) => option.ChoiceID === currentQuestions.AnswerBuilder.ChoiceID
        ) || null
      );
    }
  }, [currentQuestions, answerChoice, setValue]);

  useEffect(() => {
    if (currentQuestions?.noOfChoices) {
      setValue(
        'noOfChoices',
        noOfChoices.find((option) => option.OptionID === currentQuestions.noOfChoices.OptionID) ||
          null
      );
    }
  }, [currentQuestions, noOfChoices, setValue]);

  useEffect(() => {
    if (answerBuilderChoiceID !== '4' && answerBuilderChoiceID !== '5') {
      setSelectedQuestTypes({});

      Object.keys(watch()).forEach((key) => {
        if (key.startsWith('Choice')) {
          unregister(key);
        }
      });

      setValue('noOfChoices', null);
    }
  }, [answerBuilderChoiceID, unregister, watch, setValue]);

  const prevMaxChoicesRef = useRef(Number(values?.noOfChoices?.MaxChoices) || 0);

  useEffect(() => {
    if (values?.noOfChoices?.MaxChoices) {
      const currentMaxChoices = Number(values?.noOfChoices?.MaxChoices) || 0;
      const prevMaxChoices = prevMaxChoicesRef.current;

      if (currentMaxChoices < prevMaxChoices) {
        for (let i = currentMaxChoices + 1; i <= prevMaxChoices; i++) {
          unregister(`Choice${i}`);
        }
      }

      prevMaxChoicesRef.current = currentMaxChoices;
    }
  }, [values?.noOfChoices?.MaxChoices, unregister]);

  const handleOptionChange = (choiceIndex, value) => {
    setSelectedQuestTypes((prev) => ({ ...prev, [choiceIndex]: value }));
  };

  const InserMasterData = async (dataToSend) => {
    const encryptedPostData = Object.assign(
      {},
      ...Object.keys(dataToSend).map((key) => ({
        [key]: encrypt(dataToSend[key]),
      }))
    );
    try {
      const masterResponse = await Post('InsertQuestionnaireMst', encryptedPostData);
      if (!masterResponse?.data?.ServiceRes[0]?.QuestionnaireMstID) {
        throw new Error('Failed to retrieve QuestionnaireMstID');
      }
      const QuestionnaireMstID = decrypt(masterResponse?.data?.ServiceRes[0]?.QuestionnaireMstID);
      const DetailData = Array.from({ length: Number(values?.noOfChoices?.MaxChoices) || 0 }).map(
        (_, index) => ({
          QuestionnaireMstID,
          ChoiceID: values?.AnswerBuilder?.ChoiceID || '',
          OptionID: values?.noOfChoices?.OptionID || '',
          ChoiceText: values?.[`Choice${index + 1}`] || '',
          FileTypeID: selectedQuestTypes[index + 1] || '4',
        })
      );

      const encryptedDetail = DetailData.map((X) =>
        Object.assign(
          {},
          ...Object.keys(X).map((key) => ({
            [key]: encrypt(X[key]),
          }))
        )
      );

      const SingleDetailData = [
        {
          QuestionnaireMstID,
          ChoiceID: values?.AnswerBuilder?.ChoiceID || '',
          OptionID: values?.noOfChoices?.OptionID || '',
          ChoiceText: '',
          FileTypeID: selectedQuestTypes[0] || '4',
        },
      ];

      const encryptedSingleDetail = SingleDetailData.map((X) =>
        Object.assign(
          {},
          ...Object.keys(X).map((key) => ({
            [key]: encrypt(X[key]),
          }))
        )
      );

      if (DetailData.length > 0) {
        const detailResponse = await Post('InsertQuestionnaireDtl', encryptedDetail);
        if (detailResponse?.data?.ResponseCode === '100') {
          enqueueSnackbar('Question created successfully.', { variant: 'success' });
          router.push(paths.dashboard.RiskAnalysis.RiskMitigation.questionaries.root);
        } else {
          enqueueSnackbar('Failed to create question.', { variant: 'error' });
        }
      } else {
        const detailResponse = await Post('InsertQuestionnaireDtl', encryptedSingleDetail);
        if (detailResponse?.data?.ResponseCode === '100') {
          enqueueSnackbar('Question created successfully.', { variant: 'success' });
          router.push(paths.dashboard.RiskAnalysis.RiskMitigation.questionaries.root);
        } else {
          enqueueSnackbar('Failed to create question.', { variant: 'error' });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      enqueueSnackbar('Failed to create question.', { variant: 'error' });
    }
  };

  const UpdateMasterData = async (updateData) => {
    const encryptedPutData = Object.assign(
      {},
      ...Object.keys(updateData).map((key) => ({
        [key]: encrypt(updateData[key]),
      }))
    );
    try {
      const masterResponse = await Put('UpdateQuestionnaireMst', encryptedPutData);
      await Promise.all([
        currentQuestions?.Choices?.map(async (choice) => {
          await Delete(
            `DeleteQuestionnaireByDetailID?QuestionnaireDtlID=${choice?.QuestionnaireDtlID}`
          );
        }),
      ]);
      const QuestionnaireMstID = currentQuestions?.QuestionnaireMstID || slug;
      const DetailData = Array.from({ length: Number(values?.noOfChoices?.MaxChoices) || 0 }).map(
        (_, index) => ({
          QuestionnaireMstID,
          ChoiceID: values?.AnswerBuilder?.ChoiceID || '',
          OptionID: values?.noOfChoices?.OptionID || '',
          ChoiceText: values?.[`Choice${index + 1}`] || '',
          FileTypeID: selectedQuestTypes[index + 1] || '4',
        })
      );

      const encryptedDetail = DetailData?.map((X) =>
        Object.assign(
          {},
          ...Object.keys(X).map((key) => ({
            [key]: encrypt(X[key]),
          }))
        )
      );

      const SingleDetailData = [
        {
          QuestionnaireMstID,
          ChoiceID: values?.AnswerBuilder?.ChoiceID || '',
          OptionID: values?.noOfChoices?.OptionID || '',
          ChoiceText: '',
          FileTypeID: selectedQuestTypes[0] || '4',
        },
      ];

      const encryptedSingleDetail = SingleDetailData.map((X) =>
        Object.assign(
          {},
          ...Object.keys(X).map((key) => ({
            [key]: encrypt(X[key]),
          }))
        )
      );

      if (DetailData.length > 0) {
        const detailResponse = await Post('InsertQuestionnaireDtl', encryptedDetail);
        if (detailResponse?.data?.ResponseCode === '100') {
          enqueueSnackbar('Question updated successfully.', { variant: 'success' });
          router.push(paths.dashboard.RiskAnalysis.RiskMitigation.questionaries.root);
        } else {
          enqueueSnackbar('Failed to create question.', { variant: 'error' });
        }
      } else {
        const detailResponse = await Post('InsertQuestionnaireDtl', encryptedSingleDetail);
        if (detailResponse?.data?.ResponseCode === '100') {
          enqueueSnackbar('Question updated successfully.', { variant: 'success' });
          router.push(paths.dashboard.RiskAnalysis.RiskMitigation.questionaries.root);
        } else {
          enqueueSnackbar('Failed to create question.', { variant: 'error' });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      enqueueSnackbar('Failed to create question.', { variant: 'error' });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const Mstdata = {
      ProjectID: data?.Questionnaire?.ProjectID,
      CustomerID: data?.Classification?.CustomerID || '18',
      Tittle: data?.Title,
      Guide: data?.GuideInstruction,
      QuestionType: data?.IsMandatory ? '1' : '0',
      Question: data?.Question,
      UserID: userData[0]?.UserID,
    };

    const PutMstData = {
      QuestionnaireMstID: currentQuestions?.QuestionnaireMstID || slug,
      ProjectID: data?.Questionnaire?.ProjectID,
      CustomerID: data?.Classification?.CustomerID || '18',
      Tittle: data?.Title,
      Guide: data?.GuideInstruction,
      QuestionType: data?.IsMandatory ? '1' : '0',
      Question: data?.Question,
    };

    try {
      currentQuestions ? await UpdateMasterData(PutMstData) : await InserMasterData(Mstdata);
    } catch (error) {
      console.error(error);
    }
  });

  const renderLoading = <LoadingScreen sx={{ height: { xs: 200, md: 300 } }} />;

  return (
    <>
      {loading ? (
        renderLoading
      ) : (
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid xs={12} md={12}>
              <Card sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <RHFAutocomplete
                      name="Questionnaire"
                      label="Questionnaire"
                      placeholder="Choose an option"
                      fullWidth
                      options={allQuestionnaires}
                      value={allQuestionnaires?.find(
                        (option) => option?.ProjectID === values?.Questionnaire?.ProjectID
                      )}
                      getOptionLabel={(option) => option?.ProjectName}
                      // onchange={(i, value) => setValue('Questionnaire', value?.code)}
                    />
                  </Grid>
                  {/* <Grid item xs={12} md={6}>
                    <RHFAutocomplete
                      name="Classification"
                      label="Classification"
                      placeholder="Choose an option"
                      fullWidth
                      options={customerList}
                      value={customerList.find(
                        (option) => option?.CustomerID === values?.Classification?.CustomerID
                      )}
                      getOptionLabel={(option) => option?.CustomerName}
                      // onchange={(i, value) => setValue('Classification', value?.code)}
                    />
                  </Grid> */}
                  <Grid item xs={12} md={6}>
                    <RHFTextField name="Title" label="Title" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFTextField name="GuideInstruction" label="Guide / Instruction" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={6} px={2}>
                    {/* <RHFAutocomplete
                      name="Type"
                      label="Type"
                      placeholder="Choose an option"
                      fullWidth
                      options={qstTypes}
                      value={qstTypes.find(
                        (option) => option?.CustomerID === values?.Classification?.CustomerID
                      )}
                      getOptionLabel={(option) => option?.CustomerName}
                      // onchange={(i, value) => setValue('Classification', value?.code)}
                    /> */}
                    <Tooltip title="Is this question mandatory to answer?" arrow>
                      <RHFCheckbox
                        name="IsMandatory"
                        label="Is Mandatory"
                        sx={{ mt: 1 }}
                        helperText="(If not checked, the question will be set as optional)"
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <RHFTextField name="Question" label="Question" fullWidth />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <RHFAutocomplete
                      name="AnswerBuilder"
                      label="Answer Builder"
                      placeholder="Choose an option"
                      fullWidth
                      options={answerChoice}
                      // value={answerChoice?.find(
                      //   (option) => option?.ChoiceID === currentQuestions?.AnswerBuilder?.ChoiceID
                      // )}
                      getOptionLabel={(option) => option?.ChoiceType}
                    />
                  </Grid>

                  {(values?.AnswerBuilder?.ChoiceID === '4' ||
                    values?.AnswerBuilder?.ChoiceID === '5') && (
                    <>
                      <Grid item xs={12} md={6}>
                        <RHFAutocomplete
                          name="noOfChoices"
                          label="Number of Choices"
                          placeholder="Choose an option"
                          fullWidth
                          options={noOfChoices}
                          value={noOfChoices.find(
                            (option) => option?.OptionID === values?.noOfChoices?.OptionID
                          )}
                          getOptionLabel={(option) => option?.MaxChoices}
                          // onChange={(i, value) => setSelectedNoOfChoices(value)}
                        />
                      </Grid>
                      {values?.noOfChoices?.MaxChoices &&
                        Array.from({ length: Number(values.noOfChoices.MaxChoices) || 0 }).map(
                          (_, index) => (
                            <Grid item xs={12} md={6} key={index}>
                              <RHFTextField
                                name={`Choice${index + 1}`}
                                label={`Choice ${index + 1}`}
                                fullWidth
                              />
                            </Grid>
                          )
                        )}
                    </>
                  )}
                </Grid>
              </Card>

              <Card sx={{ p: 2, my: 2 }}>
                <Scrollbar>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                          <TableCell sx={{ minWidth: 80, fontWeight: 'bold' }}>Title</TableCell>
                          <TableCell sx={{ minWidth: 160, fontWeight: 'bold' }}>Question</TableCell>
                          {values?.AnswerBuilder?.ChoiceID === '4' ||
                          values?.AnswerBuilder?.ChoiceID === '5' ? (
                            <TableCell sx={{ minWidth: 220, fontWeight: 'bold' }}>
                              {values?.AnswerBuilder.ChoiceType}
                            </TableCell>
                          ) : (
                            <TableCell sx={{ minWidth: 220, fontWeight: 'bold' }}>
                              Answer Type
                            </TableCell>
                          )}
                          {/* <TableCell sx={{ minWidth: 20, textAlign: 'end', fontWeight: 'bold' }}>
                            Actions
                          </TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ minWidth: 80 }}>{values?.Title || '—'}</TableCell>
                          <TableCell sx={{ minWidth: 160 }}>{values?.Question || '—'}</TableCell>
                          {values?.AnswerBuilder?.ChoiceID === '4' ||
                          values?.AnswerBuilder?.ChoiceID === '5' ? (
                            <TableCell sx={{ minWidth: 220 }}>
                              <Table size="small">
                                <TableBody>
                                  {Array.from({
                                    length: Number(values?.noOfChoices?.MaxChoices) || 0,
                                  }).map((_, index) => (
                                    <TableRow
                                      key={index}
                                      hover
                                      sx={{
                                        borderBottom: '1px dashed #ddd',
                                        backgroundColor: index % 2 === 0 ? '#fafafa' : 'inherit',
                                      }}
                                    >
                                      <TableCell sx={{ pl: 2, minWidth: 60 }}>
                                        {values?.[`Choice${index + 1}`] || '—'}
                                      </TableCell>
                                      <TableCell sx={{ minWidth: 320 }}>
                                        <RadioGroup
                                          row
                                          value={selectedQuestTypes[index + 1] || '4'}
                                          onChange={(e) =>
                                            handleOptionChange(index + 1, e.target.value)
                                          }
                                          sx={{ justifyContent: 'end' }}
                                        >
                                          {questionFileTypes.map((fileType) => (
                                            <FormControlLabel
                                              key={fileType.FileTypeID}
                                              value={fileType.FileTypeID} // Use FileType as value
                                              control={<Radio />}
                                              label={fileType.FileType} // Display FileType as label
                                            />
                                          ))}
                                        </RadioGroup>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableCell>
                          ) : (
                            <TableCell
                              sx={{
                                minWidth: 220,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 4,
                              }}
                            >
                              {values?.AnswerBuilder?.ChoiceType}
                              {/* Add file select options here */}
                              <RadioGroup
                                row
                                value={selectedQuestTypes[0] || '4'}
                                onChange={(e) => handleOptionChange(0, e.target.value)}
                                sx={{ minWidth: 320, justifyContent: 'end' }}
                              >
                                {questionFileTypes.map((fileType) => (
                                  <FormControlLabel
                                    key={fileType.FileTypeID}
                                    value={fileType.FileTypeID}
                                    control={<Radio />}
                                    label={fileType.FileType}
                                  />
                                ))}
                              </RadioGroup>
                            </TableCell>
                          )}
                          {/* <TableCell sx={{ textAlign: 'end' }}>
                            <IconButton
                              onClick={() => handleContactDelete()}
                              color="error"
                              sx={{ '&:hover': { backgroundColor: 'rgba(255,0,0,0.1)' } }}
                            >
                              <Iconify icon="solar:trash-bin-trash-bold" />
                            </IconButton>
                          </TableCell> */}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
              </Card>

              <Box sx={{ mt: 3, gap: 1, display: 'flex', justifyContent: 'end' }}>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={isSubmitting}
                >
                  {currentQuestions ? 'Update Question' : 'Create Question'}
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </FormProvider>
      )}
    </>
  );
}

QaQuestionariesNewEditForm.propTypes = {
  currentQuestions: PropTypes.object,
  slug: PropTypes.string,
};

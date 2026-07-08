import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useCallback, useState, useEffect } from 'react';
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

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';
import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import Scrollbar from 'src/components/scrollbar';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { Get, Post } from 'src/utils/AxiosHelper';
import { getDecryptedUserData } from 'src/utils/getUser';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { encrypt } from 'src/api/encryption';

const answerBuilder = [
  { code: 'TEXT', label: 'Text' },
  { code: 'NUMERIC', label: 'Numeric' },
  { code: 'DATE', label: 'Date' },
  { code: 'SINGLE_CHOICE', label: 'Single Choice (Radio Buttons)' },
  { code: 'MULTIPLE_CHOICE', label: 'Multiple Choice (Checkboxes)' },
];

const noOfChoices = [
  { code: 2, label: '2' },
  { code: 3, label: '3' },
  { code: 4, label: '4' },
  { code: 5, label: '5' },
  { code: 6, label: '6' },
];
// ----------------------------------------------------------------------

export default function QaQuestionariesProjectNewEditForm({
  uploadOpen,
  uploadClose,
  allQuestionnaires,
  FetchQuestionnaire,
}) {
  const router = useRouter();
  const userData = getDecryptedUserData();

  const { enqueueSnackbar } = useSnackbar();

  const [customerList, setCustomerList] = useState([]);
  // const [questionnairesData, setQuestionnairesData] = useState([]);

  const FetchCustomerList = async () => {
    const response = await Get(`GetFilteredDataCustomer?UserID=${userData[0]?.UserID}`);
    const decryptedData = decryptObjectKeys(response?.data?.ServiceRes);
    setCustomerList(decryptedData);
  };
  // const GetProjectList = async () => {
  //   const response = await Get(`GetProjectList?CustomerID=${userData[0]?.CustomerId}`);
  //   const decryptedData = decryptObjectKeys(response?.data?.ServiceRes);
  //   console.log(decryptedData);
  //   setQuestionnairesData(decryptedData);
  // };

  useEffect(() => {
    const fetchData = async () => {
      Promise.all([FetchCustomerList()]);
    };
    fetchData();
  }, []);

  const NewQaQuestionariesSchema = Yup.object().shape({
    CustomerID: Yup.object().required('Customer is required'),
    Questionnaire: Yup.string().required('Questionnaire is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewQaQuestionariesSchema),
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

  const InsertProject = async (dataToSend) => {
    const encryptedPostData = Object.assign(
      {},
      ...Object.keys(dataToSend).map((key) => ({
        [key]: encrypt(dataToSend[key]),
      }))
    );

    const response = await Post('InsertProject', encryptedPostData);
    if (response?.data?.ResponseCode === '100') {
      enqueueSnackbar('Questionnaire added successfully', { variant: 'success' });
    } else {
      enqueueSnackbar('Questionnaire not added', { variant: 'error' });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const exists = allQuestionnaires?.some((q) => q.ProjectName === data?.Questionnaire);

    if (exists) {
      enqueueSnackbar('Questionnaire already exists', { variant: 'error' });
      return;
    }

    const dataToPOST = {
      ProjectName: data?.Questionnaire,
      CustomerID: data?.CustomerID?.CustomerID,
      UserID: userData[0]?.UserID,
    };
    try {
      await InsertProject(dataToPOST);
    } catch (error) {
      console.error(error);
    } finally {
      FetchQuestionnaire();
      uploadClose();
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <Dialog
      open={uploadOpen}
      onClose={() => {
        uploadClose(); // Call the original close function
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Add Questionnaire</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
            <RHFAutocomplete
              name="CustomerID"
              label="Customer"
              placeholder="Choose an option"
              fullWidth
              options={customerList}
              value={customerList.find(
                (option) => option.CustomerID === values?.CustomerID?.CustomerID
              )}
              getOptionLabel={(option) => option?.CustomerName}
            />

            <RHFTextField name="Questionnaire" label="Questionnaire" fullWidth />
          </Box>
          <Box sx={{ mb: 3, gap: 1, display: 'flex', justifyContent: 'end' }}>
            <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
              Save
            </LoadingButton>
          </Box>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

QaQuestionariesProjectNewEditForm.propTypes = {
  uploadOpen: PropTypes.bool,
  uploadClose: PropTypes.func,
};

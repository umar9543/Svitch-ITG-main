import * as Yup from 'yup';
import { useMemo, useCallback, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Input,
  InputAdornment,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import { LoadingScreen } from 'src/components/loading-screen';

import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
  RHFUpload,
  RHFUploadBox,
} from 'src/components/hook-form';

import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Delete, Get, Post, Put } from 'src/utils/AxiosHelper';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import Scrollbar from './scrollbar';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { ConfirmDialog } from './custom-dialog';
import sanitizeFileName from 'src/utils/sanitizeFileName';

// ----------------------------------------------------------------------

export default function UpdateCertificate({
  currentSupplier,
  currentCertificate,
  VID,
  allCountries,
}) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [openDialog, setOpenDialog] = useState(false);

  const USERDATA = JSON.parse(localStorage.getItem('UserData'));
  const [formData, setFormData] = useState({
    CertificateID: '6',
    CertificateType: 'BSCI (Business Social Compliance Initiative)',
  });
  const [selectedFile, setSelectedFile] = useState([]);
  // const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [tableData, setTableData] = useState(currentCertificate || []);
  const [FileName, setFileName] = useState('');
  const [Loading, setLoading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const [DocumentData, setDocumentData] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const getGetDocumentData = async () => {
    try {
      const res = await Get(`GetDocumentData`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setDocumentData(decryptedData);
        console.log('decryptedData', decryptedData);
      } else if (res.data.ResponseCode === '-2') {
        console.log('error in getting document data by id', res.data.ServiceRes);
      }
    } catch (error) {
      console.log('error getting document data by ID', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getGetDocumentData()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // ---------------------- XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ------------------------

  // Function to handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const NewAuthorPortalSchema = Yup.object().shape({});

  const methods = useForm({
    resolver: yupResolver(NewAuthorPortalSchema),
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

  // ------------------------------------

  const handleFileChange = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const sanitized = sanitizeFileName(file.name);
      setFileName(sanitized);
      const renamedFile = new File([file], sanitized, { type: file.type });
      setSelectedFile(renamedFile);
      setValue('File', renamedFile);
    } else {
      setFileName('');
      setSelectedFile(null);
      setValue('File', null);
    }
  };

  // Handle adding data to the table
  const handleAdd = () => {
    if (
      formData?.CertificateID == undefined ||
      formData?.CertificateFrom == null ||
      formData?.CertificateTo == null
    ) {
      return enqueueSnackbar('Please fill all the required fields', { variant: 'warning' });
    } else if (!selectedFile) {
      return enqueueSnackbar('Please upload a document', { variant: 'warning' });
    }

    // check validity between dates
    if (new Date(formData?.CertificateFrom) > new Date(formData?.CertificateTo)) {
      return enqueueSnackbar('Certificate To date should be greater than Certificate From date', {
        variant: 'error',
      });
    }
    const newEntry = {
      CertificateType: formData?.CertificateType || 'No Certificate Type selected',
      CertificateID: formData?.CertificateID || '0',
      Description: formData.Description,
      CertificateFrom: formData?.CertificateFrom
        ? format(formData?.CertificateFrom, 'yyyy-MM-dd')
        : '',
      CertificateTo: formData?.CertificateTo ? format(formData?.CertificateTo, 'yyyy-MM-dd') : '',
      FileName: selectedFile ? selectedFile.name : 'No file uploaded',
      FileToSend: selectedFile ? selectedFile : null,
    };

    // Check and replace if the CertificateID exists, otherwise add a new entry
    setTableData((prevTableData) => {
      const existingIndex = prevTableData.findIndex(
        (entry) => entry.CertificateID === newEntry.CertificateID
      );

      if (existingIndex !== -1) {
        // Replace the existing entry
        const updatedTableData = [...prevTableData];
        updatedTableData[existingIndex] = newEntry;
        return updatedTableData;
      } else {
        // Add a new entry
        return [...prevTableData, newEntry];
      }
    });

    // Reset form fields after adding
    setFormData({
      document: '',
      Description: '',
      CertificateFrom: '',
      CertificateTo: '',
      FileName: null,
      CertificateID: '6',
      CertificateType: 'BSCI (Business Social Compliance Initiative)',
    });
    setSelectedFile(null); // Reset the file input
    // setSelectedCertificate(null); // Reset the CertificateType dropdown
    reset();
    setFormData({
      CertificateID: '6',
      CertificateType: 'BSCI (Business Social Compliance Initiative)',
    });
  };

  const handleOpenConfirm = (index) => {
    setSelectedRowIndex(index);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (selectedRowIndex !== null) {
      const row = tableData[selectedRowIndex];
      handleDelete(selectedRowIndex, row?.CertificateID, row?.VenderCertificateID);
      setConfirmOpen(false);
    }
  };

  // Handle delete row from table
  const handleDelete = async (index, CertificateID, VenderCertificateID) => {
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);
    try {
      const res = await Delete(
        `DeleteVendorCertificate?VenderID=${currentSupplier?.VenderLibraryID}&CertificateID=${CertificateID}&VenderCertificateID=${VenderCertificateID}`
      );
      if (res.data.ResponseCode === '100') {
        enqueueSnackbar('Certificate deleted successfully', { variant: 'success' });
      }
    } catch (error) {
      console.log('Error deleting certificate:', error);
    }
  };

  const UpdateVendorCertificate = async (formDataToSend) => {
    try {
      // Create a new FormData instance
      const formData = new FormData();

      // Append the form fields to formData
      formData.append('VenderID', formDataToSend.VenderID);
      formData.append('CertificateID', formDataToSend.CertificateID);
      formData.append('CertificateFrom', formDataToSend.CertificateFrom);
      formData.append('CertificateTo', formDataToSend.CertificateTo);
      formData.append('Rating', '1');
      formData.append('NoValidityLimit', formDataToSend.NoValidityLimit);
      formData.append('FileName', formDataToSend.FileName);
      formData.append('Description', formDataToSend.Description);

      // Append the file
      formData.append('File', formDataToSend.FileToSend);

      // Send the request using Axios (or fetch if you prefer)
      const response = await Put('UpdateFileinFolder', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.ResponseCode === '100') {
        enqueueSnackbar('Certificate updated successfully', { variant: 'success' });
        setOpenDialog(true);
      } else {
        return enqueueSnackbar('Error updating certificate', { variant: 'error' });
      }
      // Log the response for success
      console.log('File uploaded successfully', response);
    } catch (error) {
      // Log the error in case of failure
      console.error('Error uploading file', error);
    }
  };

  const InsertVendorCertificate = async (formDataToSend) => {
    try {
      // Create a new FormData instance
      const formData = new FormData();

      // Append the form fields to formData
      formData.append('VenderID', formDataToSend.VenderID);
      formData.append('CertificateID', formDataToSend.CertificateID);
      formData.append('CertificateFrom', formDataToSend.CertificateFrom);
      formData.append('CertificateTo', formDataToSend.CertificateTo);
      formData.append('Rating', '1');
      formData.append('NoValidityLimit', formDataToSend.NoValidityLimit);
      formData.append('FileName', formDataToSend.FileName);
      formData.append('Description', formDataToSend.Description);

      // Append the file
      formData.append('File', formDataToSend.FileToSend);

      // Send the request using Axios (or fetch if you prefer)
      const response = await Post('InsertFileinFolder', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.ResponseCode === '100') {
        // Log the response for success
        console.log('File uploaded successfully');
        enqueueSnackbar('Certificate updated successfully', { variant: 'success' });
        setOpenDialog(true);
      } else {
        return enqueueSnackbar('Error updating certificate', { variant: 'error' });
      }
    } catch (error) {
      // Log the error in case of failure
      console.error('Error uploading file', error);
    }
  };
  const onSubmit = handleSubmit(async () => {
    if (tableData.length === 0) {
      return enqueueSnackbar('Please add at least one certificate', { variant: 'warning' });
    }
    if (tableData.map((item) => item.CertificateID).includes('0' || undefined || null)) {
      return enqueueSnackbar('Please select a valid certificate', { variant: 'warning' });
    }
    try {
      if (tableData?.length > 0) {
        const filteredTableData = tableData?.filter((data) => !data.VenderCertificateID);
        filteredTableData?.map(async (data) => {
          const formDataToSend = {
            VenderID: VID,
            CertificateID: data.CertificateID,
            CertificateFrom: data.CertificateFrom,
            CertificateTo: data.CertificateTo,
            Description: data.Description,
            NoValidityLimit: data.NoValidityLimit == true ? 1 : 0 || 0,
            FileName: data.FileName,
            FileToSend: data.FileToSend,
          };

          if (currentCertificate.find((item) => item.CertificateID === data.CertificateID)) {
            await UpdateVendorCertificate(formDataToSend);
          } else {
            await InsertVendorCertificate(formDataToSend);
          }
        });
      }
      reset();
      setFileName('');
      setValue('File', null);
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
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

  //   if (Loading) {
  //     return renderLoading;
  //   }

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {/* Certificates and Patents */}
        <Grid xs={12} md={12} sx={{ p: 2 }}>
          <Card sx={{ my: 3 }}>
            <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
              Supplier Details
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 2,
                px: 2,
                py: 3,
              }}
            >
              <Box>
                <Typography variant="subtitle2">Supplier Name</Typography>
                <TextField
                  name="SupplierName"
                  fullWidth
                  value={currentSupplier?.VenderName || ''}
                  disabled
                />
              </Box>
              <Box>
                <Typography variant="subtitle2">Address</Typography>
                <TextField
                  name="Address"
                  fullWidth
                  value={currentSupplier?.Address1 || ''}
                  disabled
                />
              </Box>
              <Box>
                <Typography variant="subtitle2">Country</Typography>
                <TextField
                  name="Country"
                  fullWidth
                  value={
                    allCountries?.find(
                      (country) => country.Country_id === currentSupplier?.CountryID
                    )?.CountryName || ''
                  }
                  disabled
                />
              </Box>
              <Box>
                <Typography variant="subtitle2">City</Typography>
                <TextField name="City" fullWidth value={currentSupplier?.City || ''} disabled />
              </Box>
              <Box>
                <Typography variant="subtitle2">Phone</Typography>
                <TextField
                  name="Phone"
                  fullWidth
                  value={currentSupplier?.PhoneNumber || ''}
                  disabled
                />
              </Box>
            </Box>
          </Card>
          <Card>
            <Typography variant="h6" sx={{ p: 2, my: 0.5, borderBottom: '1px solid #e0e0e0' }}>
              Certificates and Patents
            </Typography>
            <Grid container spacing={3} sx={{ p: 1.5 }}>
              <Typography variant="subtitle2" sx={{ p: 2, color: 'gray' }}>
                Please update your BSCI certificate:
              </Typography>
              <Grid container spacing={3} xs={12} md={12}>
                <Grid container xs={12} md={8} sx={{ mt: 2 }}>
                  <Grid spacing={2} xs={12} md={6}>
                    <Box>
                      <Typography variant="subtitle2">
                        Document <span style={{ color: 'red' }}>*</span>
                      </Typography>

                      <TextField
                        name="Certificate"
                        // placeholder="Certificate Description"
                        disabled
                        fullWidth
                        value="BSCI (Business Social Compliance Initiative)"
                      />
                    </Box>
                  </Grid>

                  <Grid spacing={2} xs={12} md={6}>
                    <Box>
                      <Typography variant="subtitle2">Description (if others)</Typography>
                      <TextField
                        name="Description"
                        placeholder="Certificate Description"
                        fullWidth
                        value={formData.Description || ''}
                        onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                      />
                    </Box>
                  </Grid>

                  <Grid container spacing={2} xs={12} md={12}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">
                        Validity From <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <Controller
                        name="CertificateFrom"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <DesktopDatePicker
                            format="dd/MM/yyyy"
                            value={formData?.CertificateFrom || null}
                            onChange={(newValue) => {
                              setFormData({ ...formData, CertificateFrom: newValue });
                              field.onChange(format(newValue, 'yyyy-MM-dd'));
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                              },
                            }}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                          />
                        )}
                      />
                    </Grid>

                    {/* ValidityToSA Date Field */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">
                        Validity To <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <Controller
                        name="CertificateTo"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <DesktopDatePicker
                            format="dd/MM/yyyy"
                            value={formData?.CertificateTo || null}
                            onChange={(newValue) => {
                              setFormData({ ...formData, CertificateTo: newValue });
                              field.onChange(format(newValue, 'yyyy-MM-dd'));
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                              },
                            }}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid xs={12} md={4}>
                  <RHFUpload
                    name="FileName"
                    file={selectedFile}
                    accept={{ 'application/pdf': ['.pdf'] }}
                    onDrop={handleFileChange}
                    sx={{ mt: 2 }}
                    multiple
                  />
                  <Box>{FileName ? FileName : ''}</Box>
                </Grid>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mx: 2, mb: 2 }}
                onClick={handleAdd} // Call handleAdd on click
              >
                Add
              </Button>
            </Box>
            <Scrollbar>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Certificate </TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Validity from</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell>File</TableCell>
                    {/* <TableCell></TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.CertificateType}</TableCell>
                      <TableCell>{row.Description}</TableCell>
                      <TableCell>{row?.CertificateFrom?.split(' ')[0]}</TableCell>
                      <TableCell>{row?.CertificateTo?.split(' ')[0]}</TableCell>
                      <TableCell>
                        {row?.Path ? (
                          <Link href={row?.Path || '#'} target="_blank">
                            {row.FileName}
                          </Link>
                        ) : (
                          row?.FileName
                        )}
                      </TableCell>
                      {/* <TableCell>
                        <IconButton
                          onClick={() => handleOpenConfirm(index)}
                          sx={{ color: 'error.main' }}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </Card>
        </Grid>
        <Stack alignItems="flex-end" sx={{ my: 3, pb: 3 }}>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            Save
          </LoadingButton>
        </Stack>
      </FormProvider>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete"
        content="Are you sure you want to delete?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteConfirmed}>
            Delete
          </Button>
        }
      />

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

UpdateCertificate.propTypes = {
  currentSupplier: PropTypes.any,
  currentCertificate: PropTypes.any,
  VID: PropTypes.any,
  allCountries: PropTypes.any,
};
